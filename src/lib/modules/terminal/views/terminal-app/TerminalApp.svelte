<script lang="ts">
  import { Tab } from "@/shared/components/tab";
  import {
    addNewTab,
    closeTab,
    currentTab$,
    selectTab,
    tabs$,
  } from "../../store";
  import { Button } from "@/shared/components/button";
  import { Icon } from "@/shared/components/icon";
  import { getPlatform } from "@/shared/helpers";
  import { onMount } from "svelte";
  import {
    isAutoHideToolbar$,
    isEnabledFancyBackground$,
  } from "@/modules/settings/store";
  import { invoke } from "@tauri-apps/api";
  import { Gradient } from "@/modules/terminal/components/gradient";
  import { TabView } from "../tab-view";

  const tabs = tabs$;
  const currentTab = currentTab$;
  let platform = "browser";
  const isAutoHideToolbar = isAutoHideToolbar$;
  const isEnabledFancyBackground = isEnabledFancyBackground$;

  onMount(async () => {
    platform = await getPlatform();
    isAutoHideToolbar.subscribe((value) => {
      invoke("change_toolbar", { tikness: value ? "None" : "Medium" });
    });
  });
</script>

<div class="wrapper">
  {#if $isEnabledFancyBackground}
    <Gradient />
  {/if}
  <div
    class="tabs"
    class:auto_hide_toolbar={$isAutoHideToolbar}
    class:left__offset={platform === "darwin" && !$isAutoHideToolbar}
    data-tauri-drag-region
  >
    {#each $tabs as tab}
      <Tab
        onlyOne={$tabs.length === 1}
        active={tab.id === $currentTab.id}
        on:close={() => closeTab(tab)}
        on:select={() => selectTab(tab)}>{tab.title ?? ""}</Tab
      >
    {/each}
    <div class="add_tab">
      <Button on:click={() => addNewTab()}><Icon name="plus" /></Button>
    </div>
  </div>
  <div class="view">
    {#each $tabs as tab}
      <div
        class="tab__view"
        class:tab__view__active={tab.id === $currentTab.id}
      >
        <TabView {tab} />
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .tabs {
    height: 40px;
    padding: 4px;
    display: flex;
    gap: 4px;
    background: var(--color-background);
    z-index: 1111;
  }
  .auto_hide_toolbar {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    transform: translateY(-100%);
    transition: var(--transition);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
  }
  .auto_hide_toolbar::after {
    content: "";
    position: absolute;
    left: 0;
    top: 100%;
    height: 38px;
    width: 100%;
  }

  .auto_hide_toolbar:hover {
    transform: translateY(0);
  }
  .left__offset {
    padding-left: 76px;
  }
  .view {
    flex-grow: 1;
    min-height: 0;
    display: flex;
    background-color: var(--color-background);
    position: relative;
  }
  .add_tab {
    --size: 18px;
  }
  .add_tab :global(button) {
    height: 32px;
    width: 32px;
    justify-content: center;
  }

  .tab__view {
    position: absolute;
    top: 0;
    left: -9999em; /* Offscreen to pause xterm rendering, thanks to IntersectionObserver */
    width: 100%;
    height: 100%;
  }
  .tab__view__active {
    left: 0;
  }
</style>
