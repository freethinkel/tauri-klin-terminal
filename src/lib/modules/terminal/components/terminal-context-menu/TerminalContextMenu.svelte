<script>
  import { settings$ } from "@/modules/settings/store";
  import { ContextMenu } from "@/shared/components/context-menu";

  const env = process.env.NODE_ENV;
  const isEnabledTerminalContextMenu = settings$.isEnabledTerminalContextMenu;
</script>

{#if !$isEnabledTerminalContextMenu}
  <div class="empty" on:contextmenu|preventDefault>
    <slot />
  </div>
{:else}
  <ContextMenu>
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
{/if}

<style>
  .empty {
    height: 100%;
    width: 100%;
  }
</style>
