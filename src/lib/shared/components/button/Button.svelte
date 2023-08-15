<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<button class="btn" type="button" on:click={() => dispatch("click")}>
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
    justify-content: center;
  }
  .btn:hover {
    background: rgba(255, 255, 255, 0.12);
  }
</style>
