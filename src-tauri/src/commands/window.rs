use tauri::{command, Window};

use crate::patch_window::{macos::ToolbarThickness, PatchWindow};

#[command]
pub fn change_toolbar(window: Window, tikness: ToolbarThickness) {
    window.apply_toolbar(tikness);
}
