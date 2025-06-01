use sqlx::sqlite::{SqlitePool, SqlitePoolOptions};
use std::env;
use std::error::Error;

pub struct DbConfig {
    pub connection_string: String,
    pub max_connections: u32,
}

impl Default for DbConfig {
    fn default() -> Self {
        Self {
            connection_string: env::var("DATABASE_CONNECTION_STRING")
                .unwrap_or_else(|_| "./shoyu.db".to_string()),
            max_connections: env::var("DATABASE_MAX_CONNECTIONS")
                .unwrap_or_else(|_| "5".to_string())
                .parse()
                .expect("DATABASE_MAX_CONNECTIONS must be a valid u32"), // don't mind about panic because it means the env is malformed.
        }
    }
}

pub async fn init_pool(config: &DbConfig) -> Result<SqlitePool, Box<dyn Error>> {
    println!("Max Connections: {}", config.max_connections);
    println!("Connection String: {}", &config.connection_string);

    let pool = SqlitePoolOptions::new()
        .max_connections(config.max_connections)
        .connect(&config.connection_string)
        .await?;

    Ok(pool)
}
