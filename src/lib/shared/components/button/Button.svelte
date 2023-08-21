<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let size: "normal" | "large" = "normal";

  const dispatch = createEventDispatcher();
</script>

<button
  class="btn size__{size}"
  type="button"
  on:click={() => dispatch("click")}
>
  <slot />
</button>

<style>
  .btn {
    appearance: none;
    border: none;
    padding: 4px;
    margin: 0;
    border-radius: var(--border-radius);
    background: none;
    display: flex;
    align-items: center;
    font-size: 1rem;
    text-align: left;
    height: 24px;
  }
  .btn:hover {
    background: var(--color-selection12);
  }

  .size__large {
    padding: 0 8px;
    height: 28px;
  }
</style>
