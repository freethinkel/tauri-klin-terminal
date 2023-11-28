<script lang="ts">
  import { appWindow } from "@tauri-apps/api/window";
  import { onMount } from "svelte";
  import { mappings$ } from "@/modules/settings/store/keymaps";
  import hotkeys from "hotkeys-js";
  import { keysToShortcut } from "@/modules/settings/store/helpers/keymaps";
  import {
    MappingType,
    type Mapping,
    type MappingAction,
  } from "@/modules/settings/store/types/keymaps";
  import {
    addNewTab,
    closeTab,
    currentTab$,
    selectNextTab,
    selectPrevTab,
    selectTab,
    tabs$,
  } from "@/modules/terminal/store";
  import { listen } from "@tauri-apps/api/event";
  import { changeSettings, zoomLevel$ } from "@/modules/settings/store";

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

        const tab = tabs$.getState()[index - 1];
        if (tab) {
          selectTab(tab);
        }
        return;
      }

      switch (mappingAction.type) {
        case "new_tab":
          addNewTab();
          break;
        case "close_tab":
          closeTab(currentTab$.getState());
          break;
        case "focus_prev_tab":
          selectPrevTab();
          break;
        case "focus_next_tab":
          selectNextTab();
          break;
      }
    } else if (action.type === MappingType.sendChars) {
      const chars = (action as { chars: string }).chars;
      const currentTab = currentTab$.getState();
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
            changeSettings({
              key: "zoomLevel",
              value: zoomLevel$.getState() + 0.1,
            });
            break;
          case "decrease_zoom_level":
            changeSettings({
              key: "zoomLevel",
              value: zoomLevel$.getState() - 0.1,
            });
            break;
          case "reset_zoom_level":
            changeSettings({
              key: "zoomLevel",
              value: 1,
            });
            break;
        }
      });

      mappings$.subscribe((mappings) => {
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
