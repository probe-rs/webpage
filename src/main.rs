// #![deny(warnings)]
use comrak::{markdown_to_html, ComrakOptions};
use serde::Serialize;
use serde_json::json;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use syntect::{highlighting::ThemeSet, html::highlighted_html_for_string, parsing::SyntaxSet};
use tera::{Context, Error as TeraError, Tera, Value};
use warp::Filter;

#[derive(PartialEq, Eq, Hash)]
struct CacheEntry {
    path: String,
    timestamp: std::time::SystemTime,
}

lazy_static::lazy_static! {
    // Load the code syntax & theme sets.
    static ref SS: SyntaxSet = SyntaxSet::load_defaults_newlines();
    static ref TS: ThemeSet = ThemeSet::load_defaults();
    static ref CACHE: Arc<Mutex<HashMap<String, String>>> = Arc::new(Mutex::new(HashMap::new()));
}

struct WithTemplate<T: Serialize> {
    name: String,
    value: T,
}

fn render<T>(template: WithTemplate<T>, tera: Arc<Mutex<Tera>>) -> impl warp::Reply
where
    T: Serialize,
{
    #[cfg(debug_assertions)]
    let mut guard = tera.lock().unwrap();
    #[cfg(not(debug_assertions))]
    let guard = tera.lock().unwrap();
    #[cfg(debug_assertions)]
    guard
        .full_reload()
        .unwrap_or_else(|e| log::error!("Could not reload templates {}.", e));

    let render = match Context::from_serialize(&template.value) {
        Ok(context) => guard
            .render(&template.name, &context)
            .unwrap_or_else(|err| err.to_string()),
        Err(err) => err.to_string(),
    };
    warp::reply::html(render)
}

fn colorize(args: &HashMap<String, Value>) -> Result<Value, TeraError> {
    let extension = args
        .get("extension")
        .map(|s| s.as_str().unwrap_or_else(|| "rs"))
        .unwrap_or_else(|| "rs");
    let theme = args
        .get("theme")
        .map(|s| s.as_str().unwrap_or_else(|| "InspiredGitHub"))
        .unwrap_or_else(|| "InspiredGitHub");
    let code = args
        .get("code")
        .map(|s| s.as_str().unwrap_or_else(|| "rs"))
        .unwrap_or_else(|| "");
    let syntax = SS.find_syntax_by_extension(extension).unwrap();
    let theme = &TS.themes[theme];
    Ok(highlighted_html_for_string(code, &SS, syntax, theme).into())
}

fn code(arg: &Value, _args: &HashMap<String, Value>) -> Result<Value, TeraError> {
    let path_string = match arg.as_str() {
        Some(path) => {
            #[cfg(not(debug_assertions))]
            {
                let guard = CACHE.lock().unwrap();
                if let Some(html) = guard.get(path) {
                    return Ok(html.clone().into());
                } else {
                    path
                }
            }
            #[cfg(debug_assertions)]
            path
        }
        None => return Err(TeraError::msg("argument needs to be a path")),
    };
    let path = std::path::Path::new(path_string);

    let snippet = std::fs::read_to_string(path);

    let syntax = if let Some(ext) = path.extension() {
        SS.find_syntax_by_extension(ext.to_str().unwrap()).unwrap()
    } else {
        &SS.syntaxes()[0]
    };

    let theme = &TS.themes["InspiredGitHub"];

    let snippet = highlighted_html_for_string(
        &snippet.map_err(|_e| TeraError::template_not_found(path.to_string_lossy()))?,
        &SS,
        syntax,
        theme,
    );

    let mut guard = CACHE.lock().unwrap();
    guard.insert(path_string.into(), snippet.to_string());
    Ok(snippet.into())
}

fn markdown(arg: &Value, _args: &HashMap<String, Value>) -> Result<Value, TeraError> {
    let path_string = match arg.as_str() {
        Some(path) => {
            #[cfg(not(debug_assertions))]
            {
                let guard = CACHE.lock().unwrap();
                if let Some(html) = guard.get(path) {
                    return Ok(html.clone().into());
                } else {
                    path
                }
            }
            #[cfg(debug_assertions)]
            path
        }
        None => return Err(TeraError::msg("argument needs to be a path")),
    };
    let path = std::path::Path::new(path_string);

    let snippet = std::fs::read_to_string(path);
    let snippet = markdown_to_html(
        &snippet.map_err(|_e| TeraError::template_not_found(path.to_string_lossy()))?,
        &ComrakOptions::default(),
    );

    let theme = &TS.themes["InspiredGitHub"];

    let re = regex::Regex::new(r#"<pre><code class="language-([^"]+)">([^<]*)</code>"#).unwrap();
    let snippet = re.replace(&snippet, |caps: &regex::Captures| {
        let syntax = match SS.find_syntax_by_token(&caps[1]) {
            Some(syntax) => syntax,
            None => &SS.find_syntax_plain_text(),
        };
        let code = htmlescape::decode_html(&caps[2]).unwrap();
        highlighted_html_for_string(&code, &SS, syntax, theme)
    });

    let mut guard = CACHE.lock().unwrap();
    guard.insert(path_string.into(), snippet.to_string());
    Ok(snippet.into())
}

#[tokio::main]
async fn main() {
    pretty_env_logger::init();

    // Initialize the template store.
    let mut templates = match Tera::new("templates/**/*.html") {
        Ok(t) => t,
        Err(e) => {
            println!("Parsing error(s): {}", e);
            ::std::process::exit(1);
        }
    };

    templates.register_function("colorize", colorize);
    templates.register_filter("code", code);
    templates.register_filter("markdown", markdown);
    let templates = Arc::new(Mutex::new(templates));

    // Create a reusable closure to render a template.
    let tera = move |with_template| render(with_template, templates.clone());

    let static_files = warp::path("static").and(warp::fs::dir("./static/"));

    let index = warp::path::end()
        .map(|| WithTemplate {
            name: "index.html".to_string(),
            value: json!({"page" : "index"}),
        })
        .map(tera.clone());

    let index = warp::path("index").and(index.clone()).or(index);

    let guide_index = warp::path!("guide")
        .map(|| WithTemplate {
            name: "guide/index.html".to_string(),
            value: json!({"page" : "guide"}),
        })
        .map(tera.clone());

    let guide = warp::path!("guide" / String)
        .map(|page| WithTemplate {
            name: format!("guide/{}.html", page),
            value: json!({"page" : "guide"}),
        })
        .map(tera.clone());

    //GET /
    let route = warp::get()
        .and(static_files)
        .or(index)
        .or(guide_index)
        .or(guide);

    warp::serve(route).run(([0, 0, 0, 0], 3030)).await;
}
