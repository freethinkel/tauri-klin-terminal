import type { TerminalController } from "@/controllers";

export type TerminalTab = {
  id: string;
  title?: string;
  terminalController: TerminalController;
};
