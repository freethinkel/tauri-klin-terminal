<script lang="ts">
  import { Icon } from "@/components/icon";
  import type { SvelteComponent } from "svelte";

  export let sections: Array<{
    icon: string;
    text: string;
    view?: typeof SvelteComponent;
  }> = [];

  let currentIndex = 0;

  $: currentView = sections[currentIndex].view;
</script>

<div class="wrapper" data-tauri-drag-region>
  {#each sections as section, index}
    <button
      class="section"
      class:active={index === currentIndex}
      on:click={() => (currentIndex = index)}
    >
      <Icon name={section.icon} />
      <span>{section.text}</span>
    </button>
  {/each}
</div>

<section class="body">
  {#if currentView}
    <svelte:component this={currentView} />
  {/if}
</section>

<style>
  .wrapper {
    border-bottom: 1px solid var(--color-selection12);
    padding: 0 8px 8px;
    display: flex;
    justify-content: center;
  }
  .section {
    margin: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    appearance: none;
    background: none;
    border: none;
    font-size: 0.8rem;
    font-weight: 600;
    --icon-size: 24px;
    border-radius: 10px;
    padding: 5px 10px;
    cursor: pointer;
  }
  .section:hover,
  .section.active {
    background-color: var(--color-selection12);
  }
  .section span {
    margin-top: 4px;
  }

  .body {
    padding: 10px;
    height: 100%;
    overflow: auto;
    flex: 1;
  }
</style>
