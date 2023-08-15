import type { TTheme } from "@/modules/settings/store/types/theme";
import { emit, listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { atom } from "nanostores";
import { transparentize } from "polished";

export const createSharedAtom = <T>(name: string, initialValue: T) => {
  const key = `oshmes_terminal__${name}`;
  const store = atom(initialValue);

  try {
    if (localStorage.getItem(key)) {
      // store.set(JSON.parse(localStorage.getItem(key) || "") as T);
    }
  } catch (_) {}

  let broadcast = true;

  store.listen((value) => {
    if (broadcast) {
      emit(key, value);
    }
    localStorage.setItem(key, JSON.stringify(value));
  });

  listen(key, (data) => {
    if (data.windowLabel !== appWindow.label) {
      broadcast = false;
      store.set(data.payload as T);
      broadcast = true;
    }
  });

  return store;
};

export const themeToCss = (theme: TTheme) => {
  return `:root {
--color-primary: ${theme.primary};
--color-primary12: ${transparentize(1 - 0.12, theme.primary)};
--color-selection: ${theme.selection};
--color-selection12: ${transparentize(1 - 0.12, theme.selection)};
--color-selection24: ${transparentize(1 - 0.24, theme.selection)};
--color-terminal-background: ${transparentize(0, theme.terminal.background)};
--color-terminal-background12: ${transparentize(
    1 - 0.12,
    theme.terminal.background
  )};
--color-terminal-foreground: ${transparentize(0, theme.terminal.foreground)};
--color-terminal-foreground12: ${transparentize(
    1 - 0.12,
    theme.terminal.foreground
  )};
}`;
};
