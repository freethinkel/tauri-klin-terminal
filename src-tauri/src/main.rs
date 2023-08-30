// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod menu;
mod patch_window;

use std::{
    env,
    io::{BufRead, BufReader},
};

use cocoa::{
    appkit::{NSWindow, NSWindowStyleMask},
    base::{id, nil},
    foundation::{NSString, NSUserDefaults},
};
use commands::window::change_toolbar;
use menu::AddDefaultSubmenus;
use patch_window::{macos::ToolbarThickness, PatchWindow};
use tauri::{Manager, Menu};
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

use futures_util::{AsyncRead, FutureExt, StreamExt};
use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};
use warp::{filters::ws::WebSocket, ws::Message, Filter};

struct PtyWrapper {}

impl PtyWrapper {
    pub fn read() {}
    pub fn send(data: String) {}
}

fn get_cmd() -> CommandBuilder {
    let mut cmd = CommandBuilder::new("login");
    cmd.args(["-fp", env::var("USER").unwrap().as_str()]);
    cmd.env("TERM", "xterm");
    // cmd.envs(env::vars());
    return cmd;
}

fn create_pty() {
    let pty_system = NativePtySystem::default();

    let pair = pty_system
        .openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })
        .unwrap();

    let cmd = get_cmd();
    let mut child = pair.slave.spawn_command(cmd).unwrap();

    let reader = pair.master.try_clone_reader().unwrap();
    let buf_reader = BufReader::new(reader);
    let mut lines = buf_reader.lines();
    while let Some(result) = lines.next() {
        let msg = result.unwrap();
        println!("from_pty: {:?}", msg);
    }

    // BufReader::new(reader).buffer().split(pred);
}

async fn connected(ws: WebSocket) {
    let (tx, mut rx) = ws.split();

    create_pty();

    while let Some(result) = rx.next().await {
        let msg = match result {
            Ok(msg) => msg,
            Err(e) => {
                break;
            }
        };
        let msg = msg.to_str().unwrap();
        println!("msg: {:?}", msg);
    }
}

fn main() {
    let ctx = tauri::generate_context!();

    tauri::async_runtime::spawn(async {
        println!("spawn warp");
        // The `ws()` filter will prepare the Websocket handshake.
        let routes = warp::path("websocket")
            .and(warp::ws())
            .map(|ws: warp::ws::Ws| {
                // And then our closure will be called when it completes...
                ws.on_upgrade(move |websocket| connected(websocket))
            });

        warp::serve(routes).run(([127, 0, 0, 1], 8080)).await;
    });

    tauri::Builder::default()
        .setup(|app| {
            let app = app.handle();
            app.windows().iter().for_each(|(label, window)| {
                #[cfg(target_os = "macos")]
                {
                    match label.as_str() {
                        "main" => window.apply_toolbar(ToolbarThickness::Medium),
                        _ => window.apply_toolbar(ToolbarThickness::Thin),
                    }
                    window.set_delegate();
                    if label == "settings" {
                        let ns_window: id = window.ns_window().unwrap() as id;
                        unsafe {
                            let mut style_mask = ns_window.styleMask();
                            style_mask.remove(NSWindowStyleMask::NSMiniaturizableWindowMask);
                            ns_window.setStyleMask_(style_mask);
                        }
                    }
                    apply_vibrancy(
                        &window,
                        NSVisualEffectMaterial::HudWindow,
                        Some(NSVisualEffectState::Active),
                        None,
                    )
                    .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
                }

                #[cfg(target_os = "windows")]
                apply_blur(&window, Some((18, 18, 18, 125)))
                    .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
            });
            let ud: id = unsafe { NSUserDefaults::standardUserDefaults() };
            unsafe {
                ud.setBool_forKey_(
                    false,
                    NSString::alloc(nil).init_str("ApplePressAndHoldEnabled"),
                )
            };
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![change_toolbar])
        .plugin(tauri_plugin_pty::init())
        .menu(
            Menu::new()
                .add_default_app_submenu_if_macos(&ctx.package_info().name)
                .add_default_file_submenu()
                .add_default_edit_submenu()
                .add_default_view_submenu()
                .add_default_window_submenu(),
        )
        .on_menu_event(|event| {
            let window = event.window();
            let _ = window.emit("on_menu_event", event.menu_item_id());
        })
        .run(ctx)
        .expect("error while running tauri application");
}
