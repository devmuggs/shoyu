use axum::{extract::State, http::StatusCode, Json};
use serde::Serialize;
use sqlx::SqlitePool;

use crate::features::chefs::service;

use super::model::{Chef, CreateChefRequest};

#[derive(Serialize)]
pub struct ChefsResponse {
    pub chefs: Vec<Chef>,
}

pub async fn get_chefs(State(pool): State<SqlitePool>) -> (StatusCode, Json<ChefsResponse>) {
    let chefs = service::get_chefs(&pool).await.unwrap();
    let response = ChefsResponse { chefs };
    (StatusCode::OK, Json(response))
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub message: &'static str,
}
pub async fn create_chef(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateChefRequest>,
) -> Result<(StatusCode, Json<Chef>), (StatusCode, Json<ErrorResponse>)> {
    match service::create_chef(&pool, payload).await {
        Ok(chef) => Ok((StatusCode::CREATED, Json(chef))),
        Err(_) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ErrorResponse {
                message: "failed to create chef.",
            }),
        )),
    }
}
