export const enum MappingType {
  internal = "internal",
  sendChars = "sendChars",
}

type MappingActionType =
  | "new_tab"
  | "close_tab"
  | "focus_prev_tab"
  | "focus_next_tab"
  | "close_terminal"
  | `select_tab_${number}`;

export type MappingAction = {
  type: MappingActionType;
};

export type Mapping = (
  | {
      type: null;
    }
  | {
      type: MappingType.sendChars;
      chars: string;
    }
  | {
      type: MappingType.internal;
      action: MappingAction;
    }
) & { shortcut: string[] };
