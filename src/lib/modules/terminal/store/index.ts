import { atom, computed } from "nanostores";
import { nanoid } from "nanoid";
import type { TerminalTab } from "./types";
import { settings$ } from "@/modules/settings/store";
import { createTerminal } from "./terminal";

const createTab = (): TerminalTab => {
  return {
    id: nanoid(),
    children: [createTerminal()],
  };
};

const _initialTab = createTab();

const DEFAULT = {
  tabs: <TerminalTab[]>[_initialTab],
  currentTabId: _initialTab.id,
};

const store = atom({ ...DEFAULT });

export const tabs$ = {
  tabs: computed(store, (value) => value.tabs),
  currentTab: computed(store, (value) =>
    value.tabs.find((tab) => tab.id === value.currentTabId)
  ),
  setTitle(id: string, newTitle: string) {
    const tabs = store
      .get()
      .tabs.map((tab) => (tab.id === id ? { ...tab, title: newTitle } : tab));

    store.set({
      ...store.get(),
      tabs,
    });
  },
  selectTab(id: string) {
    store.set({ ...store.get(), currentTabId: id });
  },
  closeTab(id: string) {
    const tabIndex = store
      .get()
      .tabs.indexOf(store.get().tabs.find((tab) => tab.id === id));
    const newTab = store.get().tabs.at(tabIndex - 1);

    store.set({
      ...store.get(),
      tabs: store.get().tabs.filter((tab) => tab.id !== id),
      currentTabId: newTab.id,
    });
  },
  addNewTab() {
    const newTab = createTab();
    store.set({
      ...store.get(),
      tabs: [...store.get().tabs, newTab],
      currentTabId: newTab.id,
    });
  },
};
