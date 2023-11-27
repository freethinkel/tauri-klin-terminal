import "./styles.css";
import { initTheme } from "@/shared/helpers/themes";
import { listen } from "@tauri-apps/api/event";
import { WebviewWindow, appWindow } from "@tauri-apps/api/window";

const label = appWindow.label;

const apps = {
  main: () =>
    import("@/core/app/Main.svelte").then(
      (module) =>
        new module.default({ target: document.getElementById("app") }),
    ),
  settings: () =>
    import("@/core/app/Settings.svelte").then(
      (module) =>
        new module.default({ target: document.getElementById("app") }),
    ),
};

apps[label]?.();

// document.body.addEventListener("contextmenu", (event) =>
//   event.preventDefault()
// );
//
initTheme();
