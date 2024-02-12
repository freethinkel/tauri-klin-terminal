<script lang="ts">
  import { ControlSwitch } from "@/components/control-switch";
  import { SettingsCard } from "@/components/settings-card";
  import { ThemeCard } from "@/components/theme-card";
  import { settingsStore } from "@/stores/settings";

  const themes = settingsStore.themes$;
  const currentTheme = settingsStore.currentTheme$;
  const isEnabledFancyBackground = settingsStore.isEnabledFancyBackground$;
</script>

<SettingsCard>
  <ControlSwitch
    title="Enable fancy background"
    value={$isEnabledFancyBackground}
    on:change={({ detail }) =>
      settingsStore.changeSettings({
        key: "isEnabledFancyBackground",
        value: detail,
      })}
  />
</SettingsCard>

<div class="wrapper">
  <div class="themes">
    {#each $themes as theme}
      <ThemeCard
        on:select={() => settingsStore.setTheme(theme.name)}
        {theme}
        active={theme.name === $currentTheme.name}
      />
    {/each}
  </div>
</div>

<style>
  .themes {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
</style>
