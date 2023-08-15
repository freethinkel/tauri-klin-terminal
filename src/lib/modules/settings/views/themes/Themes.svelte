<script lang="ts">
  import { ThemeCard } from "../../components/theme-card";
  import { settings$ } from "../../store";

  const themes = settings$.themes;
  const currentTheme = settings$.currentTheme;
</script>

<div class="wrapper">
  {#each $themes as theme}
    <ThemeCard
      on:select={() => settings$.setTheme(theme.name)}
      {theme}
      active={theme.name === $currentTheme.name}
    />
  {/each}
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
</style>
