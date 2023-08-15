<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Icon } from "../icon";

  export let active = false;
  export let onlyOne = false;

  const dispatch = createEventDispatcher();
</script>

<button
  data-tauri-drag-region
  class="wrapper"
  class:only_one={onlyOne}
  class:active
  on:click|preventDefault={() => dispatch("select")}
>
  <div class="inner" data-tauri-drag-region>
    <slot />
  </div>
  {#if !onlyOne}
    <button
      class="close-btn"
      on:click|stopPropagation={() => dispatch("close")}
    >
      <Icon name="x" />
    </button>
  {/if}
</button>

<style>
  .wrapper {
    padding: 4px;
    background: transparent;
    border: none;
    font-size: 1rem;
    border-radius: var(--border-radius);
    flex: 1;
    margin: 0;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .wrapper:hover,
  .wrapper.active {
    background: var(--color-selection12);
  }
  .wrapper.only_one {
    background: transparent;
  }
  .inner {
    flex-grow: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    min-width: 0;
    max-width: 100%;
  }
  .close-btn {
    padding: 0;
    margin: 0;
    height: 26px;
    min-height: 26px;
    min-width: 26px;
    width: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    background: none;
    border: none;
    --size: 16px;
  }
  .close-btn:hover {
    background: var(--color-selection12);
    border-radius: var(--border-radius);
  }
</style>
