import { settings$ } from "@/modules/settings/store";
import type { TTheme } from "@/modules/settings/store/types/theme";
import { computed } from "nanostores";
import { darken, transparentize } from "polished";

export const themeToCss = (theme: TTheme) => {
  return `:root {
--color-primary: ${theme.primary};
--color-primary12: ${transparentize(1 - 0.12, theme.primary)};
--color-selection: ${theme.selection};
--color-selection12: ${transparentize(1 - 0.12, theme.selection)};
--color-selection24: ${transparentize(1 - 0.24, theme.selection)};
--color-selection80: ${transparentize(1 - 0.8, theme.selection)};
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

--color-accent: ${theme.terminal.blue};
--color-accent12: ${transparentize(1 - 0.12, theme.terminal.blue)};
--color-accent80: ${transparentize(1 - 0.8, theme.terminal.blue)};
}`;
};

const listenOpacity = () => {
  const style = document.createElement("style");
  document.head.appendChild(style);
  computed([settings$.opacity, settings$.currentTheme], (opacity, theme) => ({
    opacity,
    color: theme.primary,
  })).subscribe(({ opacity, color }) => {
    style.innerHTML = `
:root {
--color-background: ${transparentize(1 - opacity, color)};
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

  settings$.currentTheme.subscribe(applyTheme);
};

export const initTheme = () => {
  listenTheme();
  listenOpacity();
};
