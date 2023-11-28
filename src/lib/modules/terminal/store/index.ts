import { nanoid } from "nanoid";
import { TerminalController, type TerminalTab } from "./types";
import { createTerminal } from "./terminal";
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from "effector";

const createTab = (): TerminalTab => {
  return {
    id: nanoid(),
    terminalController: new TerminalController(createTerminal()),
  };
};
const _initialTab = createTab();

const tabs$ = createStore([_initialTab]);
const currentTabId$ = createStore(_initialTab.id);

const currentTab$ = combine(tabs$, currentTabId$, (tabs, id) =>
  tabs.find((tab) => tab.id === id),
);

const selectTab = createEvent<TerminalTab>();
const closeTab = createEvent<TerminalTab>();
const addNewTab = createEvent();
const setTitle = createEvent<{ tabId: string; title: string }>();
const selectNextTab = createEvent();
const selectPrevTab = createEvent();
// Internal actions
const newTabCreated = createEvent<TerminalTab>();
const tabClosed = createEvent<{ newTab: TerminalTab; tabs: TerminalTab[] }>();

const asyncTerminalFocusFx = createEffect((terminal: TerminalController) => {
  setTimeout(() => {
    terminal.focus();
  });
});

sample({
  clock: selectNextTab,
  source: {
    currentTab: currentTab$,
    tabs: tabs$,
  },
  fn: ({ tabs, currentTab }) => {
    const currentTabIndex = tabs.indexOf(currentTab);
    const newTabIndex =
      currentTabIndex + 1 === tabs.length ? 0 : currentTabIndex + 1;

    return tabs[newTabIndex];
  },
  target: selectTab,
});

sample({
  clock: selectPrevTab,
  source: {
    currentTab: currentTab$,
    tabs: tabs$,
  },
  fn: ({ tabs, currentTab }) => {
    const currentTabIndex = tabs.indexOf(currentTab);
    const newTabIndex =
      currentTabIndex == 0 ? tabs.length - 1 : currentTabIndex - 1;

    return tabs[newTabIndex];
  },
  target: selectTab,
});

sample({
  clock: selectTab,
  fn: (tab) => tab.id,
  target: currentTabId$,
});

sample({
  clock: selectTab,
  fn: (tab) => tab.terminalController,
  target: asyncTerminalFocusFx,
});

sample({
  clock: closeTab,
  source: tabs$,
  fn: (tabs, closedTab) => {
    const tabIndex = tabs.indexOf(tabs.find((tab) => tab.id === closedTab.id));
    const newTab = tabs.at(tabIndex - 1);

    return {
      tabs: tabs.filter((tab) => tab.id !== closedTab.id),
      newTab,
    };
  },
  target: tabClosed,
});

sample({
  clock: tabClosed,
  fn: (event) => event.newTab,
  target: selectTab,
});

sample({
  clock: tabClosed,
  fn: (event) => event.tabs,
  target: tabs$,
});

sample({
  clock: addNewTab,
  fn: () => createTab(),
  target: newTabCreated,
});

sample({
  clock: newTabCreated,
  source: tabs$,
  fn: (tabs, newTab) => [...tabs, newTab],
  target: tabs$,
});

sample({
  clock: newTabCreated,
  target: selectTab,
});

sample({
  clock: setTitle,
  source: tabs$,
  fn: (tabs, event) =>
    tabs.map((tab) =>
      tab.id === event.tabId ? { ...tab, title: event.title } : tab,
    ),
  target: tabs$,
});

export {
  tabs$,
  currentTab$,
  selectTab,
  addNewTab,
  closeTab,
  setTitle,
  selectPrevTab,
  selectNextTab,
};
