import "./styles.css";
import { initTheme } from "@/shared/helpers/themes";
import { appWindow } from "@tauri-apps/api/window";

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

initTheme();
