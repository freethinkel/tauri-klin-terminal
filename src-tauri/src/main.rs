// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod patch_window;

use cocoa::{
    appkit::{NSWindow, NSWindowStyleMask},
    base::{id, nil},
    foundation::{NSString, NSUserDefaults},
};
use patch_window::{macos::ToolbarThickness, PatchWindow};
use tauri::Manager;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

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
        .plugin(tauri_plugin_pty::init())
        .run(ctx)
        .expect("error while running tauri application");
}
