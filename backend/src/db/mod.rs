use rusqlite::{Connection, Result};
use std::fs;

pub fn initialise() -> Result<()> {
    let connection = Connection::open("shoyu.db")?;

    let sql_init_file_path = "./migrations/init.sql";

    let sql_file_content =
        fs::read_to_string(sql_init_file_path).expect("Should have been able to read file");

    connection.execute_batch(&sql_file_content)?;

    Ok(())
}
