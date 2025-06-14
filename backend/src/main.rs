mod db;
pub mod features;

use axum::{http::Method, routing::get, Router};
use features::chefs::router::chef_router;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::layer;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    let pool = db::initialise().await?; // Call synchronously here and handle error properly

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any);

    let base_router = Router::new()
        .route("/hello", get(|| async { "Hello World! " }))
        .nest("/chefs", chef_router(pool.clone()))
        .layer(cors);

    let app = Router::new().nest("/api/v1", base_router);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;

    Ok(())
}

// notes:
// using :: similar to cpp to access properties/methods
// initialise()?; <- will throw error directly instead of using match
// use Ok(()) to return the Result
// () <- basically void
// || <- start of lambda expression, params go between Pipes
