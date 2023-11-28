import { createSharedStore } from "@/shared/helpers";
import type { SettingsStore } from "./types";
import { CORE_THEMES } from "./core/themes";
import { createEvent, sample } from "effector";

const DEFAULT: SettingsStore = {
  themes: [...CORE_THEMES],
  currentThemeName: CORE_THEMES[0].name,
  fontSize: 13,
  fontFamily: "Menlo",
  lineHeight: 1.1,
  opacity: 1,
  isAutoHideToolbar: false,
  isEnabledFancyBackground: false,
  isEnabledTerminalContextMenu: true,
  zoomLevel: 1,
};

const settings$ = createSharedStore(
  "settings",
  { ...DEFAULT },
  {
    restoreMap: (store) => ({ ...store, themes: DEFAULT.themes, zoomLevel: 1 }),
  },
);

const themes$ = settings$.map((value) => value.themes);
const currentTheme$ = settings$.map((value) =>
  value.themes.find((theme) => theme.name === value.currentThemeName),
);
const isAutoHideToolbar$ = settings$.map((value) => value.isAutoHideToolbar);
const isEnabledFancyBackground$ = settings$.map(
  (value) => value.isEnabledFancyBackground,
);
const isEnabledTerminalContextMenu$ = settings$.map(
  (value) => value.isEnabledTerminalContextMenu,
);

const fontFamily$ = settings$.map((value) => value.fontFamily);
const fontSize$ = settings$.map((value) => value.fontSize);
const lineHeight$ = settings$.map((value) => value.lineHeight);
const opacity$ = settings$.map((value) => value.opacity);
const zoomLevel$ = settings$.map((value) => value.zoomLevel);

type PickSettings<K extends keyof typeof DEFAULT = keyof typeof DEFAULT> = {
  key: K;
  value: (typeof DEFAULT)[K];
};

const setTheme = createEvent<string>();
const changeSettings = createEvent<PickSettings>();

sample({
  clock: changeSettings,
  source: settings$,
  fn: (store, payload) => ({
    ...store,
    [payload.key]: payload.value,
  }),
  target: settings$,
});

sample({
  clock: setTheme,
  source: settings$,
  fn: (store, theme) => ({
    ...store,
    currentThemeName: theme,
  }),
  target: settings$,
});

export {
  settings$,
  themes$,
  currentTheme$,
  isAutoHideToolbar$,
  isEnabledFancyBackground$,
  isEnabledTerminalContextMenu$,
  fontFamily$,
  fontSize$,
  lineHeight$,
  opacity$,
  zoomLevel$,
  changeSettings,
  setTheme,
};
