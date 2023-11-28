import { nanoid } from "nanoid";
import { TauriPtyAddon } from "tauri-plugin-pty";
import type { ITerminalAddon, Terminal } from "xterm";

export type TerminalTab = {
  id: string;
  title?: string;
  terminalController: TerminalController;
};

export class TerminalController {
  children: Array<TerminalController>;
  parent?: TerminalController;
  id: string = nanoid();

  terminal: Terminal;

  get addons() {
    return (
      this.terminal as unknown as {
        _addonManager: { _addons: (ITerminalAddon & { instance: unknown })[] };
      }
    )._addonManager._addons;
  }

  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }

  splitDown(): void {}
  splitRight(): void {}

  focus(): void {
    setTimeout(() => {
      this.terminal.focus();
    });
  }

  async paste(): Promise<void> {
    const clipboardText = await navigator.clipboard.readText();
    this.terminal.paste(clipboardText);
  }

  async copySelectedText(): Promise<void> {
    const selection = this.terminal.getSelection();
    await navigator.clipboard.writeText(selection);
  }

  sendChars(chars: string) {
    const addon = this.addons.find(
      (addon) => addon.instance instanceof TauriPtyAddon,
    )?.instance as TauriPtyAddon | undefined;
    addon?.sendData(chars);
  }
}
