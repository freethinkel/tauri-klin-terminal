<script lang="ts">
  import { ThemeCard } from "../../components/theme-card";
  import {
    themes$,
    currentTheme$,
    isEnabledFancyBackground$,
    changeSettings,
    setTheme,
  } from "../../store";
  import { SettingsCard } from "../../components/settings-card";
  import { ControlSwitch } from "../../components/control-switch";

  const themes = themes$;
  const currentTheme = currentTheme$;
  const isEnabledFancyBackground = isEnabledFancyBackground$;
</script>

<SettingsCard>
  <ControlSwitch
    title="Enable fancy background"
    value={$isEnabledFancyBackground}
    on:change={({ detail }) =>
      changeSettings({ key: "isEnabledFancyBackground", value: detail })}
  />
</SettingsCard>

<div class="wrapper">
  <div class="themes">
    {#each $themes as theme}
      <ThemeCard
        on:select={() => setTheme(theme.name)}
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
