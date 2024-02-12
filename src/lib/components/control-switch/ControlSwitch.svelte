<script lang="ts">
  import { Toggle } from "@/components/toggle";
  import { createEventDispatcher } from "svelte";

  export let title = "";
  export let description = "";
  export let value = false;

  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrapper control" on:click={() => dispatch("change", !value)}>
  <div class="content">
    <div class="title">{title}</div>
    <div class="description">{description}</div>
  </div>
  <div class="value" on:click|preventDefault>
    <Toggle
      checked={value}
      on:change={({ detail }) => dispatch("change", detail)}
    />
  </div>
</div>

<style lang="postcss">
  .wrapper {
    display: flex;
    cursor: pointer;
    &:hover {
      background: var(--color-background);
    }
  }
  .title {
    font-size: 1.1rem;
  }

  .content {
    flex: 1;
    min-width: 0;
  }
</style>
