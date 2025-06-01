use config::init_pool;
use sqlx::SqlitePool;
use std::error::Error;

mod config;

pub async fn initialise() -> Result<SqlitePool, Box<dyn Error>> {
    let pool = init_pool(&config::DbConfig::default()).await?;

    let sql_init_file_path = "./migrations/0001_create_initial_tables.sql";
    let sql_file_content = tokio::fs::read_to_string(sql_init_file_path).await?;

    for statement in sql_file_content.split(";") {
        let statement = statement.trim();
        if statement.is_empty() {
            continue;
        };

        sqlx::query(statement).execute(&pool).await?;
    }

    Ok(pool)
}
