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

fn main() {
    let ctx = tauri::generate_context!();

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
