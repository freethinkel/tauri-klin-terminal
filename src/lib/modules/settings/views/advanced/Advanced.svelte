<script lang="ts">
  import { Toggle } from "@/shared/components/toggle";
  import { settings$ } from "../../store";
  import { ControlSwitch } from "../../components/control-switch";
  import { SettingsCard } from "../../components/settings-card";

  const isAutohide = settings$.isAutoHideToolbar;
  const isEnabledTerminalContextMenu = settings$.isEnabledTerminalContextMenu;
</script>

<SettingsCard>
  <ControlSwitch
    value={$isAutohide}
    on:change={({ detail }) =>
      settings$.handleChange("isAutoHideToolbar")(detail)}
    title="Auto hide toolbar"
  />
  <ControlSwitch
    value={!$isEnabledTerminalContextMenu}
    on:change={({ detail }) =>
      settings$.handleChange("isEnabledTerminalContextMenu")(!detail)}
    title="Disable context menu"
  />
</SettingsCard>
