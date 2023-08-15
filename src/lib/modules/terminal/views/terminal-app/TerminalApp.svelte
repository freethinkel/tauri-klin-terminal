<script lang="ts">
  import { Terminal } from "@/modules/terminal/components/terminal";
  import { Tab } from "@/shared/components/tab";
  import { tabs$ } from "../../store";
  import { Button } from "@/shared/components/button";
  import { Icon } from "@/shared/components/icon";

  const tabs = tabs$.tabs;
  const currentTab = tabs$.currentTab;
</script>

<div class="wrapper">
  <div class="tabs" data-tauri-drag-region>
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
        <div class="tab_view" class:active={tab.id === $currentTab.id}>
          {#each tab.children as terminal}
            <Terminal
              {terminal}
              on:change_title={({ detail }) => tabs$.setTitle(tab.id, detail)}
            />
          {/each}
        </div>
      {/key}
    {/each}
  </div>
</div>

<style>
  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .tabs {
    height: 40px;
    padding: 4px;
    padding-left: 76px;
    display: flex;
    gap: 4px;
  }
  .view {
    flex-grow: 1;
    min-height: 0;
    display: flex;
  }
  .tab_view {
    display: none;
    flex-grow: 1;
    width: 100%;
  }
  .tab_view.active {
    display: flex;
  }
  .add_tab {
    --size: 18px;
  }
  .add_tab :global(button) {
    height: 32px;
    width: 32px;
  }
</style>
