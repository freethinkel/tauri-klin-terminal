import {
  MappingType,
  type MappingAction,
  type Mapping,
} from "../types/keymaps";

export const AVAILABLE_ACTIONS = Object.fromEntries(
  (
    [
      {
        type: "new_tab",
        label: "Open new tab",
      },
      {
        type: "close_tab",
        label: "Close tab",
      },
      {
        type: "focus_prev_tab",
        label: "Focus prev tab",
      },
      {
        type: "focus_next_tab",
        label: "Focus next tab",
      },
      ...Array(9)
        .fill(null)
        .map(
          (_, i) =>
            ({
              type: `select_tab_${i + 1}`,
              label: `Select tab ${i + 1}`,
            }) as const,
        ),
    ] as const
  ).map((item) => [item.type, item] as const),
) satisfies Record<string, MappingAction>;

export const DEFAULT_ACTIONS: Mapping[] = [
  {
    type: MappingType.internal,
    action: AVAILABLE_ACTIONS.new_tab,
    shortcut: "meta+t".split("+"),
  },
  {
    type: MappingType.internal,
    action: AVAILABLE_ACTIONS.close_tab,
    shortcut: "meta+w".split("+"),
  },
  {
    type: MappingType.internal,
    action: AVAILABLE_ACTIONS.focus_prev_tab,
    shortcut: "meta+shift+[".split("+"),
  },
  {
    type: MappingType.internal,
    action: AVAILABLE_ACTIONS.focus_next_tab,
    shortcut: "meta+shift+]".split("+"),
  },
  {
    type: MappingType.internal,
    action: AVAILABLE_ACTIONS.focus_prev_tab,
    shortcut: "ctrl+shift+tab".split("+"),
  },
  {
    type: MappingType.internal,
    action: AVAILABLE_ACTIONS.focus_next_tab,
    shortcut: "control+tab".split("+"),
  },
  ...Array(9)
    .fill(null)
    .map(
      (_, i) =>
        ({
          type: MappingType.internal,
          action: AVAILABLE_ACTIONS[`select_tab_${i + 1}`],
          shortcut: `meta+${i + 1}`.split("+"),
        }) as Mapping,
    ),
];
