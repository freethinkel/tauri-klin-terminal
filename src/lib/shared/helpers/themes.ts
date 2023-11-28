import { currentTheme$, opacity$ } from "@/modules/settings/store";
import type { TTheme } from "@/modules/settings/store/types/theme";
import { combine } from "effector";
import { mix, transparentize } from "polished";

export const themeToCss = (theme: TTheme) => {
  return `:root {
--color-primary: ${theme.primary};
--color-primary12: ${transparentize(1 - 0.12, theme.primary)};
--color-selection: ${theme.selection};
--color-selection12: ${transparentize(1 - 0.12, theme.selection)};
--color-selection24: ${transparentize(1 - 0.24, theme.selection)};
--color-selection50: ${transparentize(1 - 0.5, theme.selection)};
--color-selection80: ${transparentize(1 - 0.8, theme.selection)};
--color-terminal-background: ${transparentize(0, theme.terminal.background)};
--color-terminal-background12: ${transparentize(
    1 - 0.12,
    theme.terminal.background,
  )};
--color-terminal-foreground: ${transparentize(0, theme.terminal.foreground)};
--color-terminal-foreground12: ${transparentize(
    1 - 0.12,
    theme.terminal.foreground,
  )};

--color-accent: ${theme.terminal.blue};
--color-accent12: ${transparentize(1 - 0.12, theme.terminal.blue)};
--color-accent50: ${transparentize(1 - 0.5, theme.terminal.blue)};
--color-accent80: ${transparentize(1 - 0.8, theme.terminal.blue)};
--color-theme-red: ${theme.terminal.red};
--color-theme-black: ${theme.terminal.black};
--color-theme-cyan: ${theme.terminal.cyan};
}`;
};

const listenOpacity = () => {
  const style = document.createElement("style");
  document.head.appendChild(style);
  // const a= merge([opacity$, currentTheme$])
  combine(opacity$, currentTheme$, (opacity, theme) => ({
    opacity,
    color: theme.primary,
  })).subscribe(({ opacity, color }) => {
    const background = transparentize(1 - opacity, color);
    style.innerHTML = `
:root {
--color-background: ${background};
--color-gradient-start: ${mix(
      0.88,
      background,
      transparentize(1 - opacity, "#ffffff"),
    )};
--color-gradient-end: ${mix(
      1,
      background,
      transparentize(1 - opacity, "#ffffff"),
    )};
}
`;
  });
};

const listenTheme = () => {
  const style = document.createElement("style");
  document.head.appendChild(style);
  const applyTheme = (theme: TTheme) => {
    style.innerHTML = themeToCss(theme);
  };

  currentTheme$.subscribe(applyTheme);
};

export const initTheme = () => {
  listenTheme();
  listenOpacity();
};
