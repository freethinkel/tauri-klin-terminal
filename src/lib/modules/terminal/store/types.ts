import { nanoid } from "nanoid";
import type { Terminal } from "xterm";

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
}
