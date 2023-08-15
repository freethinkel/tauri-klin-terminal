import type { TTheme } from "../../types/theme";
import defaultTheme from "./default.json";
import mountainTheme from "./mountain.json";
import tokyoNightTheme from "./tokyo-night.json";

export const CORE_THEMES: Array<TTheme> = [
  defaultTheme,
  tokyoNightTheme,
  mountainTheme,
];
