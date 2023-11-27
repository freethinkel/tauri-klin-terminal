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
            // tauri::async_runtime::spawn(async {
            //     HttpServer::new(|| {
            //         App::new().webterm_socket("/websocket", |_req| {
            //             let mut cmd = Command::new("login");
            //             cmd.args(["-fp", env::var("USER").unwrap().as_str()]);
            //             cmd.env("TERM", "xterm");
            //             cmd.envs(env::vars());
            //             return cmd;
            //         })
            //     })
            //     .bind(format!("{}:{}", "localhost", "8080"))
            //     .unwrap()
            //     .run()
            //     .expect("error run server");
            // });
            Ok(())
        })
        .build()
}
