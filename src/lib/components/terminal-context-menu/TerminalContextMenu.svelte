<script>
  import { ContextMenu } from "@/components/context-menu";
  import { settingsStore } from "@/stores/settings";

  const env = process.env.NODE_ENV;
  const isEnabledTerminalContextMenu =
    settingsStore.isEnabledTerminalContextMenu$;
</script>

<ContextMenu disabled={!$isEnabledTerminalContextMenu}>
  <div slot="menu">
    {#if env === "development"}
      <ContextMenu.Button
        on:click={() => window.location.reload()}
        icon="reload">Reload</ContextMenu.Button
      >
      <ContextMenu.Separator />
    {/if}

    <ContextMenu.Button icon="clipboard">Copy</ContextMenu.Button>
    <ContextMenu.Button icon="clipboard">Paste</ContextMenu.Button>
    <ContextMenu.Button icon="select-all">Select All</ContextMenu.Button>
    <ContextMenu.Button icon="clear-all">Clear buffer</ContextMenu.Button>
    <ContextMenu.Separator />
    <ContextMenu.Button icon="plus">New tab</ContextMenu.Button>
    <ContextMenu.Separator />
    <ContextMenu.Button icon="arrow-down">Split down</ContextMenu.Button>
    <ContextMenu.Button icon="arrow-right">Split right</ContextMenu.Button>
    <ContextMenu.Separator />
    <ContextMenu.Button icon="x">Close</ContextMenu.Button>
  </div>
  <slot />
</ContextMenu>

<style>
  .empty {
    height: 100%;
    width: 100%;
  }
</style>
