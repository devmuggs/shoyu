use axum::{http::StatusCode, Json};
use serde::Serialize;

use crate::features::chefs::service;

#[derive(Serialize)]
pub struct ChefsResponse {
    pub chefs: Vec<String>,
}

pub async fn get_chefs() -> (StatusCode, Json<ChefsResponse>) {
    let chefs = service::get_chefs();
    let response = ChefsResponse { chefs };
    (StatusCode::OK, Json(response))
}
