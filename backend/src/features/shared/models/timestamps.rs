use chrono::{DateTime, Utc};
use serde::Serialize;

#[derive(Serialize)]
pub struct TimestampsJSON {
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub deleted_at: Option<DateTime<Utc>>,
}
