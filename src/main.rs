#![deny(warnings)]
use std::sync::Arc;
use serde::Serialize;
use serde_json::json;
use warp::Filter;
use tera::{Tera, Context};

struct WithTemplate<T: Serialize> {
    name: &'static str,
    value: T,
}

fn render<T>(template: WithTemplate<T>, tera: Arc<Tera>) -> impl warp::Reply
where
    T: Serialize,
{
    let render = match Context::from_serialize(&template.value) {
        Ok(context) => tera.render(template.name, &context).unwrap_or_else(|err| err.to_string()),
        Err(err) => err.to_string(),
    };
    warp::reply::html(render)
}

#[tokio::main]
async fn main() {
    // Initialize the template store.
    let templates = match Tera::new("templates/**/*.html") {
        Ok(t) => t,
        Err(e) => {
            println!("Parsing error(s): {}", e);
            ::std::process::exit(1);
        }
    };
    let templates = Arc::new(templates);

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