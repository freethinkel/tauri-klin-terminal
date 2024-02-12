export const keysToShortcut = (keys: string[]): string => {
  return keys
    .map(
      (char) =>
        ({
          meta: "command",
          " ": "space",
        })[char.toLowerCase()] || char,
    )
    .join("+");
};
