import { emit, listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { platform } from "@tauri-apps/api/os";
import { createEvent, createStore, sample } from "effector";

type Options<T> = {
  invalidate?: (store: T) => boolean;
  restoreMap?: (store: T) => T;
};

export const createSharedStore = <T>(
  name: string,
  initialValue: T,
  options?: Options<T>,
) => {
  const key = `klin_terminal__${name}`;
  const store = createStore(initialValue);

  const valueSetted = createEvent<T>();

  sample({
    clock: valueSetted,
    target: store,
  });

  try {
    if (localStorage.getItem(key)) {
      const cachedValue = JSON.parse(localStorage.getItem(key) || "") as T;
      if (!options?.invalidate?.(cachedValue)) {
        valueSetted(
          options?.restoreMap ? options?.restoreMap(cachedValue) : cachedValue,
        );
      }
    }
  } catch (_) {}

  let broadcast = true;

  store.watch((value) => {
    if (broadcast) {
      emit(key, value);
    }
    localStorage.setItem(key, JSON.stringify(value));
  });

  listen(key, (data) => {
    if (data.windowLabel !== appWindow.label) {
      broadcast = false;
      valueSetted(data.payload as T);
      broadcast = true;
    }
  });

  return store;
};

export const getPlatform = async (): Promise<
  ReturnType<typeof platform> | "browser"
> => {
  try {
    return await platform();
  } catch (err) {
    return "browser";
  }
};
