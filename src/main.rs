#![deny(warnings)]
use std::sync::{Arc, Mutex};
use serde::Serialize;
use serde_json::json;
use warp::Filter;
use tera::{Tera, Error as TeraError, Context, Value};
use std::collections::HashMap;
use syntect::{
    html::highlighted_html_for_string,
    parsing::SyntaxSet,
    highlighting::ThemeSet,
};

lazy_static::lazy_static! {
    // Load the code syntax & theme sets.
    static ref SS: SyntaxSet = SyntaxSet::load_defaults_newlines();
    static ref TS: ThemeSet = ThemeSet::load_defaults();
}

struct WithTemplate<T: Serialize> {
    name: &'static str,
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
    guard.full_reload().unwrap_or_else(|e| log::error!("Could not reload templates {}.", e));

    let render = match Context::from_serialize(&template.value) {
        Ok(context) => guard.render(template.name, &context).unwrap_or_else(|err| err.to_string()),
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
    let templates = Arc::new(Mutex::new(templates));

    // Create a reusable closure to render a template.
    let tera = move |with_template| render(with_template, templates.clone());

    let static_files = warp::path("static").and(warp::fs::dir("./static/"));

    let index = warp::path::end()
        .map(|| WithTemplate {
            name: "index.html",
            value: json!({"page" : "index"}),
        })
        .map(tera.clone());

    let index = warp::path("index").and(index.clone()).or(index);

    let guide = warp::get()
        .and(warp::path("guide"))
        .and(warp::path::end())
        .map(|| WithTemplate {
            name: "guide.html",
            value: json!({"page" : "guide"}),
        })
        .map(tera.clone());

    //GET /
    let route = warp::get()
        .and(static_files)
        .or(index)
        .or(guide);

    warp::serve(route).run(([0, 0, 0, 0], 3030)).await;
}