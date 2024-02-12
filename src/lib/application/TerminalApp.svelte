<script lang="ts">
  import { Tab } from "@/components/tab";
  import { Button } from "@/components/button";
  import { Icon } from "@/components/icon";
  import { getPlatform } from "@/helpers";
  import { onMount } from "svelte";
  import { invoke } from "@tauri-apps/api";
  import { settingsStore } from "@/stores/settings";
  import { Gradient } from "@/components/gradient";
  import { tabsStore } from "@/stores/tabs";
  import { WebviewWindow } from "@tauri-apps/api/window";
  import { listen } from "@tauri-apps/api/event";
  import { TabView } from "@/views/tab-view";

  const tabs = tabsStore.tabs$;
  const currentTab = tabsStore.currentTab$;
  let platform = "browser";
  const isAutoHideToolbar = settingsStore.isAutoHideToolbar$;
  const isEnabledFancyBackground = settingsStore.isEnabledFancyBackground$;

  onMount(async () => {
    platform = await getPlatform();
    isAutoHideToolbar.subscribe((value) => {
      invoke("change_toolbar", { tikness: value ? "None" : "Medium" });
    });
    listen("on_menu_event", (event) => {
      if (event.payload === "settings") {
        new WebviewWindow("settings").show();
      }
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
        on:close={() => tabsStore.closeTab(tab)}
        on:select={() => tabsStore.selectTab(tab)}>{tab.title ?? ""}</Tab
      >
    {/each}
    <div class="add_tab">
      <Button on:click={() => tabsStore.addNewTab()}
        ><Icon name="plus" /></Button
      >
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
