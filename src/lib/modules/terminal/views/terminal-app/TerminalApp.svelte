<script lang="ts">
  import { Terminal } from "@/modules/terminal/components/terminal";
  import { Tab } from "@/shared/components/tab";
  import { tabs$ } from "../../store";
  import { Button } from "@/shared/components/button";
  import { Icon } from "@/shared/components/icon";
  import { getPlatform } from "@/shared/helpers";
  import { TerminalContextMenu } from "../../components/terminal-context-menu";
  import { onMount } from "svelte";
  import { settings$ } from "@/modules/settings/store";
  import { invoke } from "@tauri-apps/api";
  import { Gradient } from "@/modules/terminal/components/gradient";
  import { TabView } from "../tab-view";

  const tabs = tabs$.tabs;
  const currentTab = tabs$.currentTab;
  let platform = "browser";
  const isAutoHideToolbar = settings$.isAutoHideToolbar;
  const isEnabledFancyBackground = settings$.isEnabledFancyBackground;

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
        on:close={() => tabs$.closeTab(tab.id)}
        on:select={() => tabs$.selectTab(tab.id)}>{tab.title ?? ""}</Tab
      >
    {/each}
    <div class="add_tab">
      <Button on:click={() => tabs$.addNewTab()}><Icon name="plus" /></Button>
    </div>
  </div>
  <div class="view">
    {#each $tabs as tab}
      {#key tab.id}
        {#if tab.id === $currentTab.id}
          <TabView {tab} />
        {/if}
      {/key}
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
  }
  .add_tab {
    --size: 18px;
  }
  .add_tab :global(button) {
    height: 32px;
    width: 32px;
    justify-content: center;
  }
</style>
