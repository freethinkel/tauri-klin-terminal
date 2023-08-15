#[macro_use]
extern crate serde_json;
#[macro_use]
extern crate log;

use actix_web::{App, HttpServer};
use serde::{ser::Serializer, Serialize};
use socket_term::launch;
use tauri::{
    plugin::{Builder, TauriPlugin},
    Runtime,
};
use webterm::WebTermExt;

use std::{env, process::Command};
mod event;
mod socket_term;
mod terminado;
mod webterm;

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("pty")
        .setup(|app| {
            tauri::async_runtime::spawn(async {
                HttpServer::new(|| {
                    App::new().webterm_socket("/websocket", |_req| {
                        let mut cmd = Command::new("login");
                        cmd.args(["-fp", env::var("USER").unwrap().as_str()]);
                        cmd.env("TERM", "xterm");
                        cmd.envs(env::vars());
                        return cmd;
                    })
                })
                .bind(format!("{}:{}", "localhost", "8080"))
                .unwrap()
                .run()
                .expect("error run server");
            });
            Ok(())
        })
        .build()
}
