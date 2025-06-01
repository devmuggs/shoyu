use crate::features::shared::models::timestamps;
use serde::Serialize;

#[derive(Serialize)]
pub struct Chef {
    pub id: i32,
    pub display_name: String,
    pub email: String,
    pub role_id: i32,
    #[serde(flatten)]
    pub timestamps: timestamps::TimestampsJSON,
}
