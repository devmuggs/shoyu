use crate::features::chefs::controller;
use axum::{routing, Router};

pub fn chef_router() -> Router {
    Router::new().route("/", routing::get(controller::get_chefs))
}
