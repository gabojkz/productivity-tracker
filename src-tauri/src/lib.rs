use tauri_plugin_sql::{Migration, MigrationKind, DbInstances};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn initialize_database(db_instances: tauri::State<'_, DbInstances>) -> Result<(), String> {
    // The migrations are handled automatically by the plugin
    // We just need to check if the database is loaded
    let instances = db_instances.0.read().await;
    if instances.contains_key("sqlite:productivity_tracker.db") {
        println!("Database initialized successfully");
    } else {
        println!("Database not yet loaded");
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:productivity_tracker.db", vec![
                    Migration {
                        version: 1,
                        description: "Create initial tables",
                        sql: "CREATE TABLE IF NOT EXISTS tasks (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT NOT NULL,
                            description TEXT,
                            status TEXT DEFAULT 'pending',
                            priority TEXT DEFAULT 'medium',
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            completed_at DATETIME,
                            due_date DATETIME
                        );
                        
                        CREATE TABLE IF NOT EXISTS time_entries (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            task_id INTEGER,
                            start_time DATETIME NOT NULL,
                            end_time DATETIME,
                            duration_minutes INTEGER,
                            notes TEXT,
                            FOREIGN KEY (task_id) REFERENCES tasks (id)
                        );
                        
                        CREATE TABLE IF NOT EXISTS daily_goals (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            date DATE NOT NULL,
                            goal_type TEXT NOT NULL,
                            target_value INTEGER,
                            actual_value INTEGER DEFAULT 0,
                            notes TEXT
                        );
                        
                        CREATE TABLE IF NOT EXISTS productivity_sessions (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            date DATE NOT NULL,
                            start_time DATETIME NOT NULL,
                            end_time DATETIME,
                            focus_score INTEGER,
                            energy_level INTEGER,
                            notes TEXT
                        );",
                        kind: MigrationKind::Up,
                    },
                ])
                .build()
        )
        .invoke_handler(tauri::generate_handler![greet, initialize_database])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
