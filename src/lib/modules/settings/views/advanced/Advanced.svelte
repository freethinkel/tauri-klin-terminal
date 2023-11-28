<script lang="ts">
  import {
    changeSettings,
    isAutoHideToolbar$,
    isEnabledTerminalContextMenu$,
  } from "../../store";
  import { ControlSwitch } from "../../components/control-switch";
  import { SettingsCard } from "../../components/settings-card";

  const isAutohide = isAutoHideToolbar$;
  const isEnabledTerminalContextMenu = isEnabledTerminalContextMenu$;
</script>

<SettingsCard>
  <ControlSwitch
    value={$isAutohide}
    on:change={({ detail }) =>
      changeSettings({ key: "isAutoHideToolbar", value: detail })}
    title="Auto hide toolbar"
  />
  <ControlSwitch
    value={!$isEnabledTerminalContextMenu}
    on:change={({ detail }) =>
      changeSettings({ key: "isEnabledTerminalContextMenu", value: !detail })}
    title="Disable context menu"
  />
</SettingsCard>
