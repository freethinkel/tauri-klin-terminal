<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { TTheme } from "../../store/types/theme";
  import { transparentize } from "polished";

  export let theme: TTheme;
  export let active = false;

  const dispatch = createEventDispatcher();

  $: terminalColors = Object.entries(theme.terminal).filter(
    ([key]) =>
      key.toLowerCase().indexOf("bright") === -1 &&
      !["background"].includes(key)
  );

  const sizes = [60, 90, 30, 60, 50, 110, 30, 40, 105];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="wrapper"
  class:active
  on:click={() => dispatch("select")}
  style:background={transparentize(1 - 0.8, theme.terminal.background)}
  style:border-color={transparentize(1 - 0.12, theme.selection)}
>
  <div class="lines">
    {#each terminalColors as color, i}
      <div
        class="line"
        style:background={color[1] + ""}
        style:width={sizes[i] + "px"}
      />
    {/each}
  </div>
  <div
    class="info"
    style:border-color={transparentize(1 - 0.12, theme.selection)}
  >
    <div class="name">{theme.name}</div>
  </div>
</div>

<style>
  .wrapper {
    border-radius: var(--border-radius);
    border: 1px solid;
  }
  .wrapper.active {
    box-shadow: 0 3px 3px 0 var(--color-selection12),
      0 0 0 2px var(--color-selection);
  }
  .info {
    border-top: 1px solid;
    width: 100%;
    padding: 6px;
  }
  .lines {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .line {
    height: 10px;
    border-radius: var(--border-radius);
  }
</style>
