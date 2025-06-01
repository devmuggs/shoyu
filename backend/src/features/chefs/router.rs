use crate::features::chefs::controller;
use axum::{routing, Router};
use sqlx::SqlitePool;

pub fn chef_router(pool: SqlitePool) -> Router {
    Router::new()
        .route("/", routing::get(controller::get_chefs))
        .route("/", routing::post(controller::create_chef))
        .with_state(pool.clone())
}
