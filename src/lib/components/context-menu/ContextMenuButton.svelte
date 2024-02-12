<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "../button";
  import { Icon } from "../icon";

  export let icon: string = "";

  const dispatch = createEventDispatcher();
</script>

<Button
  size="large"
  on:mouseup={({ detail }) => detail.button === 2 && dispatch("click")}
  on:click={() => dispatch("click")}
>
  <div class="inner">
    {#if icon}
      <Icon name={icon} />
    {/if}
    <slot />
  </div>
</Button>

<style>
  :global(button) {
    width: 100%;
  }
  .inner {
    display: flex;
    gap: 4px;
    align-items: center;
    --size: 18px;
    --color: var(--color-selection80);
  }
</style>
