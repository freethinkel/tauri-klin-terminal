import { emit, listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { platform } from "@tauri-apps/api/os";
import { atom } from "nanostores";

type Options<T> = {
  invalidate?: (store: T) => boolean;
  restoreMap?: (store: T) => T;
};

export const createSharedAtom = <T>(
  name: string,
  initialValue: T,
  options?: Options<T>
) => {
  const key = `oshmes_terminal__${name}`;
  const store = atom(initialValue);

  try {
    if (localStorage.getItem(key)) {
      const cachedValue = JSON.parse(localStorage.getItem(key) || "") as T;
      if (!options?.invalidate?.(cachedValue)) {
        store.set(
          options?.restoreMap ? options?.restoreMap(cachedValue) : cachedValue
        );
      }
    }
  } catch (_) {}

  let broadcast = true;

  store.listen((value) => {
    if (broadcast) {
      emit(key, value);
    }
    localStorage.setItem(key, JSON.stringify(value));
  });

  listen(key, (data) => {
    if (data.windowLabel !== appWindow.label) {
      broadcast = false;
      store.set(data.payload as T);
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
