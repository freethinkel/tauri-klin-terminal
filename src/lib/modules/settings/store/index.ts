import { createSharedAtom } from "@/shared/helpers";
import { computed } from "nanostores";
import type { SettingsStore } from "./types";
import { CORE_THEMES } from "./core/themes";

const DEFAULT: SettingsStore = {
  themes: [...CORE_THEMES],
  currentThemeName: CORE_THEMES[0].name,
  fontSize: 13,
  fontFamily: "Menlo",
  lineHeight: 1.1,
};

const store = createSharedAtom("settings", { ...DEFAULT });

// const useChangeKey = <K extends keyof SettingsStore>(key: K) =>  => store.set({...store.get(), [key]: value})

export const settings$ = {
  subscribe: store.subscribe,
  listen: store.listen,
  themes: computed(store, (value) => value.themes),
  currentTheme: computed(store, (value) =>
    value.themes.find((theme) => theme.name === value.currentThemeName)
  ),
  setTheme(theme: string) {
    store.set({ ...store.get(), currentThemeName: theme });
  },
};
