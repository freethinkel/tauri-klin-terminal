<script lang="ts">
  import { slide } from "svelte/transition";

  export let disabled = false;

  let isOpen = false;
  let position = { x: 0, y: 0 };

  const onContextMenu = (event: MouseEvent) => {
    if (disabled) {
      return;
    }
    position.x = event.x;
    position.y = event.y;
    isOpen = true;
  };

  const close = () => {
    isOpen = false;
  };
</script>

<svelte:window on:blur={close} />

<svelte:body on:mousedown={close} />

<div class="wrapper">
  <div
    role="menu"
    tabindex="-1"
    class="inner"
    on:contextmenu|preventDefault={onContextMenu}
  >
    <slot />
  </div>

  {#if isOpen}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      transition:slide={{ duration: 100 }}
      on:mousedown|stopPropagation
      on:mouseup={() => setTimeout(() => (isOpen = false))}
      class="menu"
      style:top={position.y + "px"}
      style:left={position.x + "px"}
      on:contextmenu|preventDefault
    >
      <slot name="menu" />
    </div>
  {/if}
</div>

<style>
  .wrapper,
  .inner {
    width: 100%;
    height: 100%;
  }
  .menu {
    position: fixed;
    z-index: 10000;
    background: var(--color-primary);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-selection24);
    box-shadow: var(--shadow1);
    padding: 6px;
    min-width: 180px;
  }
</style>
