import ContextMenuComponent from "./ContextMenu.svelte";
import ContextMenuButton from "./ContextMenuButton.svelte";
import ContextMenuSeparator from "./ContextMenuSeparator.svelte";

const ContextMenu = ContextMenuComponent as unknown &
  typeof ContextMenuComponent & {
    Button: typeof ContextMenuButton;
    Separator: typeof ContextMenuSeparator;
  };

ContextMenu.Button = ContextMenuButton;
ContextMenu.Separator = ContextMenuSeparator;

export { ContextMenu };
