use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, FromRow)]
pub struct DbChef {
    pub id: Option<i64>, // ← make this optional
    pub display_name: String,
    pub email: String,
    pub created_at: Option<i64>,
    pub updated_at: Option<i64>,
    pub deleted_at: Option<i64>,
    pub role_id: Option<i64>,
    pub role_name: String,
}

#[derive(Debug, Serialize)]
pub struct Chef {
    pub id: Option<i64>, // ← make this optional
    pub display_name: String,
    pub email: String,
    pub created_at: Option<i64>,
    pub updated_at: Option<i64>,
    pub deleted_at: Option<i64>,
    pub role: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateChefRequest {
    pub display_name: String,
    pub email: String,
    pub password: String,
    pub role_id: i64,
}

impl From<DbChef> for Chef {
    fn from(db: DbChef) -> Self {
        Self {
            id: db.id,
            display_name: db.display_name,
            email: db.email,
            created_at: db.created_at,
            updated_at: db.updated_at,
            deleted_at: db.deleted_at,
            role: db.role_name,
        }
    }
}
