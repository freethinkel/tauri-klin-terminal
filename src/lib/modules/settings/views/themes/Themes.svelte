<script lang="ts">
  import { Input } from "@/shared/components/input";
  import { ThemeCard } from "../../components/theme-card";
  import { settings$ } from "../../store";
  import { Toggle } from "@/shared/components/toggle";

  const themes = settings$.themes;
  const currentTheme = settings$.currentTheme;
  const isEnabledFancyBackground = settings$.isEnabledFancyBackground;
</script>

<div class="wrapper">
  <div class="form_group">
    <Toggle
      checked={$isEnabledFancyBackground}
      on:change={({ detail }) =>
        settings$.handleChange("isEnabledFancyBackground")(detail)}
      >Enable fancy background</Toggle
    >
    <Input label="Custom background" type="color" />
  </div>
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
  .form_group {
    margin-bottom: 10px;
    display: flex;
    gap: 6px;
  }
  .form_group > :global(*) {
    flex: 1;
  }
  .themes {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
</style>
