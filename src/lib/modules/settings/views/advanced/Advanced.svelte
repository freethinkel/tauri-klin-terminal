<script lang="ts">
  import { Toggle } from "@/shared/components/toggle";
  import { settings$ } from "../../store";

  const isAutohide = settings$.isAutoHideToolbar;
  const isEnabledTerminalContextMenu = settings$.isEnabledTerminalContextMenu;
</script>

<div class="field">
  <Toggle
    checked={$isAutohide}
    on:change={({ detail }) =>
      settings$.handleChange("isAutoHideToolbar")(detail)}
  >
    Auto hide toolbar
  </Toggle>
</div>

<div class="field">
  <Toggle
    checked={!$isEnabledTerminalContextMenu}
    on:change={({ detail }) =>
      settings$.handleChange("isEnabledTerminalContextMenu")(!detail)}
  >
    Disable context menu
  </Toggle>
</div>

<style>
  .field {
    margin-top: 6px;
  }
</style>
