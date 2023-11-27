import type { TTheme } from "../../types/theme";
import defaultTheme from "./default.json";
import mountainTheme from "./mountain.json";
import tokyoNightTheme from "./tokyo-night.json";
import monokaiProTheme from "./monokai_pro.json";
import nordTheme from "./nord.json";

export const CORE_THEMES: Array<TTheme> = [
  defaultTheme,
  tokyoNightTheme,
  mountainTheme,
  monokaiProTheme,
  nordTheme,
];
