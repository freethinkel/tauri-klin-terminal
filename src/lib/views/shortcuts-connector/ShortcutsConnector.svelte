<script lang="ts">
  import { appWindow } from "@tauri-apps/api/window";
  import { onMount } from "svelte";
  import hotkeys from "hotkeys-js";
  import { listen } from "@tauri-apps/api/event";
  import { MappingType, type Mapping, type MappingAction } from "@/types";
  import { settingsStore } from "@/stores/settings";
  import { keymapsStore } from "@/stores/keymaps";
  import { keysToShortcut } from "@/stores/keymaps/keymaps.helpers";
  import { tabsStore } from "@/stores/tabs";

  const parseCharsToEscaped = (chars: string): string => {
    const numbers = [
      ...chars.match(RegExp("\\x([0-9a-fA-F]){0,2}", "gmi")),
    ].map((e) => e.replaceAll("x", ""));

    const allChars = numbers.map((e) => String.fromCharCode(parseInt(e, 16)));

    return allChars.join("");
  };

  const handleShortcut = (action: Mapping, _event: KeyboardEvent) => {
    if (action.type === MappingType.internal) {
      const mappingAction = (action as { action: MappingAction }).action;

      if (mappingAction.type.indexOf("select_tab_") === 0) {
        const index = Number(mappingAction.type.replace("select_tab_", ""));

        const tab = tabsStore.tabs$.getState()[index - 1];
        if (tab) {
          tabsStore.selectTab(tab);
        }
        return;
      }

      switch (mappingAction.type) {
        case "new_tab":
          tabsStore.addNewTab();
          break;
        case "close_tab":
          tabsStore.closeTab(tabsStore.currentTab$.getState());
          break;
        case "focus_prev_tab":
          tabsStore.selectPrevTab();
          break;
        case "focus_next_tab":
          tabsStore.selectNextTab();
          break;
      }
    } else if (action.type === MappingType.sendChars) {
      const chars = (action as { chars: string }).chars;
      const currentTab = tabsStore.currentTab$.getState();
      if (chars) {
        const parsedChars = parseCharsToEscaped(chars);
        currentTab.terminalController.sendChars(parsedChars);
      }
    }
  };

  onMount(() => {
    if (appWindow.label === "main") {
      listen("on_menu_event", (event) => {
        switch (event.payload) {
          case "increaze_zoom_level":
            settingsStore.changeSettings({
              key: "zoomLevel",
              value: settingsStore.zoomLevel$.getState() + 0.1,
            });
            break;
          case "decrease_zoom_level":
            settingsStore.changeSettings({
              key: "zoomLevel",
              value: settingsStore.zoomLevel$.getState() - 0.1,
            });
            break;
          case "reset_zoom_level":
            settingsStore.changeSettings({
              key: "zoomLevel",
              value: 1,
            });
            break;
        }
      });

      keymapsStore.mappings$.subscribe((mappings) => {
        hotkeys.unbind();
        hotkeys.filter = function () {
          return true;
        };

        mappings.forEach((mapping) => {
          const shortcut = keysToShortcut(mapping.shortcut);
          if (!shortcut) {
            return;
          }

          hotkeys(shortcut, (event) => {
            handleShortcut(mapping, event);
            event.preventDefault();
          });
        });
      });
    }
  });
</script>

<slot />
