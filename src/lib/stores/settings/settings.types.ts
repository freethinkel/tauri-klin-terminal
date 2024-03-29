import type { TTheme } from "@/types";

export type SettingsStore = {
  themes: Array<TTheme>;
  currentThemeName: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  opacity: number;
  isAutoHideToolbar: boolean;
  isEnabledFancyBackground: boolean;
  isEnabledTerminalContextMenu: boolean;
  zoomLevel: number;
};
