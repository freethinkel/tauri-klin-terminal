<script lang="ts">
  import { ControlSwitch } from "@/components/control-switch";
  import { SettingsCard } from "@/components/settings-card";
  import { settingsStore } from "@/stores/settings";

  const isAutohide = settingsStore.isAutoHideToolbar$;
  const isEnabledTerminalContextMenu =
    settingsStore.isEnabledTerminalContextMenu$;
</script>

<SettingsCard>
  <ControlSwitch
    value={$isAutohide}
    on:change={({ detail }) =>
      settingsStore.changeSettings({ key: "isAutoHideToolbar", value: detail })}
    title="Auto hide toolbar"
  />
  <ControlSwitch
    value={!$isEnabledTerminalContextMenu}
    on:change={({ detail }) =>
      settingsStore.changeSettings({
        key: "isEnabledTerminalContextMenu",
        value: !detail,
      })}
    title="Disable context menu"
  />
</SettingsCard>
