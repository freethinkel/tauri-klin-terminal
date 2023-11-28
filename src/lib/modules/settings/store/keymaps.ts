import { MappingType, type Mapping, type MappingAction } from "./types/keymaps";
import { DEFAULT_ACTIONS } from "./constants/keymaps";
import { createSharedStore } from "@/shared/helpers";
import { createEvent, sample } from "effector";

const mappings$ = createSharedStore("keymaps", [...DEFAULT_ACTIONS], {});

const addEmptyMapping = createEvent();
const addMapping = createEvent<Mapping>();
const deleteMapping = createEvent<Mapping>();

const changeShortcut = createEvent<{
  mapping: Mapping;
  payload: string[];
}>();

const changeType = createEvent<{
  mapping: Mapping;
  payload: MappingType;
}>();

const changeAction = createEvent<{
  mapping: Mapping;
  payload: MappingAction;
}>();

const changeSendChars = createEvent<{
  mapping: Mapping;
  payload: string;
}>();

sample({
  clock: changeShortcut,
  source: mappings$,
  fn: (mappings, event) =>
    mappings.map((mapping) =>
      mapping === event.mapping
        ? { ...mapping, shortcut: event.payload }
        : mapping,
    ),
  target: mappings$,
});

sample({
  clock: changeType,
  source: mappings$,
  fn: (mappings, event) =>
    mappings.map((mapping) =>
      mapping === event.mapping
        ? ({ ...mapping, type: event.payload } as Mapping)
        : mapping,
    ),
  target: mappings$,
});

sample({
  clock: changeAction,
  source: mappings$,
  fn: (mappings, event) =>
    mappings.map((mapping) =>
      mapping === event.mapping
        ? ({ ...mapping, action: event.payload } as Mapping)
        : mapping,
    ),
  target: mappings$,
});

sample({
  clock: changeSendChars,
  source: mappings$,
  fn: (mappings, event) =>
    mappings.map((mapping) =>
      mapping === event.mapping
        ? ({ ...mapping, chars: event.payload } as Mapping)
        : mapping,
    ),
  target: mappings$,
});

sample({
  clock: addEmptyMapping,
  fn: () => ({
    type: null,
    shortcut: [],
  }),
  target: addMapping,
});

sample({
  clock: addMapping,
  source: mappings$,
  fn: (store, event) => [...store, event],
  target: mappings$,
});

sample({
  clock: deleteMapping,
  source: mappings$,
  fn: (mappings, mapping) => mappings.filter((item) => item !== mapping),
  target: mappings$,
});

export {
  mappings$,
  addEmptyMapping,
  deleteMapping,
  changeShortcut,
  changeType,
  changeAction,
  changeSendChars,
};
