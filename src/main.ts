import "./styles.css";
import { initTheme } from "@/helpers/themes";
import { appWindow } from "@tauri-apps/api/window";

const label = appWindow.label;

const targetElement = document.getElementById("app")!;

const apps = {
  main: () =>
    import("@/application/TerminalApp.svelte").then(
      (module) => new module.default({ target: targetElement }),
    ),
  settings: () =>
    import("@/application/Settings.svelte").then(
      (module) => new module.default({ target: targetElement }),
    ),
};

apps[label]?.();

initTheme();
