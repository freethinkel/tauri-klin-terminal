mod pty;

use pty::ws_server::pty_serve;

use tauri::{
    plugin::{Builder, TauriPlugin},
    Runtime,
};

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("pty")
        .setup(|app| {
            std::thread::spawn(|| {
                let rt = tokio::runtime::Runtime::new().unwrap();
                rt.block_on(async { pty_serve().await });
            });
            Ok(())
        })
        .build()
}
