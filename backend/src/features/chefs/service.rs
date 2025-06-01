use sqlx::SqlitePool;

use crate::features::chefs::model::DbChef;

use super::model::{Chef, CreateChefRequest};

pub async fn get_chefs(pool: &SqlitePool) -> Result<Vec<Chef>, sqlx::Error> {
    let db_chefs = sqlx::query_as!(
        DbChef,
        r#"
        SELECT 
            chefs.id, 
            chefs.display_name, 
            chefs.email, 
            chefs.created_at, 
            chefs.updated_at,
            chefs.deleted_at,
            chefs.role_id,
            system_roles.name as role_name
        FROM chefs
        JOIN system_roles ON chefs.role_id = system_roles.id
        "#
    )
    .fetch_all(pool)
    .await?;

    for chef in &db_chefs {
        println!("{:?}", chef);
    }

    let chefs = db_chefs.into_iter().map(Into::into).collect();

    Ok(chefs)
}

pub async fn create_chef(pool: &SqlitePool, data: CreateChefRequest) -> Result<Chef, sqlx::Error> {
    sqlx::query!(
        r#"
        INSERT INTO chefs (display_name, email, password, role_id)
        VALUES (?, ?, ?, ?)
        "#,
        data.display_name,
        data.email,
        data.password,
        data.role_id,
    )
    .execute(pool)
    .await?;

    let chef = sqlx::query_as!(
        DbChef,
        r#"
        SELECT 
            chefs.id,
            chefs.display_name,
            chefs.email,
            chefs.created_at,
            chefs.updated_at,
            chefs.deleted_at,
            chefs.role_id,
            system_roles.name AS role_name
        FROM chefs
        JOIN system_roles ON chefs.role_id = system_roles.id
        WHERE chefs.id = last_insert_rowid()
        "#
    )
    .fetch_one(pool)
    .await?;

    Ok(chef.into())
}
