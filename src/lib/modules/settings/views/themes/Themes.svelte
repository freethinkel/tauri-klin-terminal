<script lang="ts">
  import { ThemeCard } from "../../components/theme-card";
  import { settings$ } from "../../store";
  import { SettingsCard } from "../../components/settings-card";
  import { ControlSwitch } from "../../components/control-switch";

  const themes = settings$.themes;
  const currentTheme = settings$.currentTheme;
  const isEnabledFancyBackground = settings$.isEnabledFancyBackground;
</script>

<SettingsCard>
  <ControlSwitch
    title="Enable fancy background"
    value={$isEnabledFancyBackground}
    on:change={({ detail }) =>
      settings$.handleChange("isEnabledFancyBackground")(detail)}
  />
</SettingsCard>

<div class="wrapper">
  <div class="themes">
    {#each $themes as theme}
      <ThemeCard
        on:select={() => settings$.setTheme(theme.name)}
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
