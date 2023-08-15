import "./styles.css";
import { settings$ } from "@/modules/settings/store";
import type { TTheme } from "@/modules/settings/store/types/theme";
import { themeToCss } from "@/shared/helpers";
import { appWindow } from "@tauri-apps/api/window";

const label = appWindow.label;

const apps = {
  main: () =>
    import("@/core/app/Main.svelte").then(
      (module) => new module.default({ target: document.getElementById("app") })
    ),
  settings: () =>
    import("@/core/app/Settings.svelte").then(
      (module) => new module.default({ target: document.getElementById("app") })
    ),
};

apps[label]?.();

const style = document.createElement("style");
document.head.appendChild(style);
const applyTheme = (theme: TTheme) => {
  style.innerHTML = themeToCss(theme);
};

settings$.currentTheme.subscribe(applyTheme);
