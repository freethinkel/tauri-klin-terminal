import type { Terminal } from "xterm";

export type TerminalTab = {
  id: string;
  title?: string;
  children: Array<Terminal>;
};
