<script>
  import { ContextMenu } from "@/shared/components/context-menu";
</script>

<ContextMenu>
  <div slot="menu">
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
