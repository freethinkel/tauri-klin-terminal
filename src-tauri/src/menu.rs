use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu};

pub trait AddDefaultSubmenus {
    fn default() -> Self;
    fn add_default_submenu(self, submenu: SubmenuKind) -> Self;
}
enum SubmenuKind {
    App,
    File,
    Edit,
    View,
    Window,
}

impl AddDefaultSubmenus for Menu {
    fn default() -> Menu {
        let menu = Menu::new()
            .add_default_submenu(SubmenuKind::App)
            .add_default_submenu(SubmenuKind::File)
            .add_default_submenu(SubmenuKind::Edit)
            .add_default_submenu(SubmenuKind::View)
            .add_default_submenu(SubmenuKind::Window);

        return menu.clone();
    }

    fn add_default_submenu(self, submenu: SubmenuKind) -> Self {
        match submenu {
            SubmenuKind::App =>
            {
                #[cfg(target_os = "macos")]
                self.add_submenu(Submenu::new(
                    "Klin",
                    Menu::new()
                        .add_native_item(MenuItem::About("Klin".to_string(), AboutMetadata::new()))
                        .add_native_item(MenuItem::Separator)
                        .add_item(
                            CustomMenuItem::new("settings".to_string(), "Settings")
                                .accelerator("Cmd+,"),
                        )
                        .add_native_item(MenuItem::Services)
                        .add_native_item(MenuItem::Separator)
                        .add_native_item(MenuItem::Hide)
                        .add_native_item(MenuItem::HideOthers)
                        .add_native_item(MenuItem::ShowAll)
                        .add_native_item(MenuItem::Separator)
                        .add_native_item(MenuItem::Quit),
                ))
            }

            SubmenuKind::File => self.add_submenu(Submenu::new(
                "File",
                #[cfg(target_os = "macos")]
                {
                    Menu::new().add_native_item(MenuItem::CloseWindow);
                    Menu::new().add_native_item(MenuItem::Quit)
                },
            )),

            SubmenuKind::Edit => self.add_submenu(Submenu::new("Edit", {
                let mut menu = Menu::new();
                menu = menu.add_native_item(MenuItem::Undo);
                menu = menu.add_native_item(MenuItem::Redo);
                menu = menu.add_native_item(MenuItem::Separator);
                menu = menu.add_native_item(MenuItem::Cut);
                menu = menu.add_native_item(MenuItem::Copy);
                menu = menu.add_native_item(MenuItem::Paste);
                #[cfg(not(target_os = "macos"))]
                {
                    menu = menu.add_native_item(MenuItem::Separator);
                }
                menu = menu.add_native_item(MenuItem::SelectAll);
                menu
            })),

            SubmenuKind::View => self.add_submenu(Submenu::new("View", {
                let mut view_menu = Menu::new().add_native_item(MenuItem::EnterFullScreen);

                view_menu = view_menu.add_item(
                    CustomMenuItem::new("reset_zoom_level".to_string(), "Reset zoom level")
                        .accelerator("CmdOrCtrl+0"),
                );
                view_menu = view_menu.add_item(
                    CustomMenuItem::new("increaze_zoom_level".to_string(), "Zoom in")
                        .accelerator("CmdOrCtrl+Plus"),
                );
                view_menu = view_menu.add_item(
                    CustomMenuItem::new("decrease_zoom_level".to_string(), "Zoom out")
                        .accelerator("CmdOrCtrl+-"),
                );

                view_menu
            })),

            SubmenuKind::Window => self.add_submenu(Submenu::new("Window", {
                let menu = Menu::new()
                    .add_native_item(MenuItem::Minimize)
                    .add_native_item(MenuItem::Zoom);
                menu
            })), // SubmenuKind::Help(url) => {
        }
    }
}
