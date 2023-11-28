<script lang="ts">
  import { TerminalApp } from "@/modules/terminal/views/terminal-app";
  import { listen } from "@tauri-apps/api/event";
  import { WebviewWindow } from "@tauri-apps/api/window";
  import { onMount } from "svelte";
  import ShortcutsConnector from "./ShortcutsConnector.svelte";

  onMount(() => {
    listen("on_menu_event", (event) => {
      if (event.payload === "settings") {
        new WebviewWindow("settings").show();
      }
    });
  });
</script>

<ShortcutsConnector>
  <TerminalApp />
</ShortcutsConnector>
