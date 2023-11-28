import {
  currentTheme$,
  fontFamily$,
  fontSize$,
  lineHeight$,
  settings$,
  zoomLevel$,
} from "@/modules/settings/store";
import { transparentize } from "polished";
import { TauriPtyAddon } from "tauri-plugin-pty";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebglAddon } from "xterm-addon-webgl";
import { Unicode11Addon } from "xterm-addon-unicode11";
import { combine } from "effector";

const loadAddons = async (terminal: Terminal) => {
  const ws = new WebSocket("ws://127.0.0.1:7703");
  const fitAddon = new FitAddon();

  const tauriPtyAddon = new TauriPtyAddon(ws);
  const webglAddon = new WebglAddon(false);
  const unicodeAddon = new Unicode11Addon();
  // const ligaturesAddon = new LigaturesAddon();

  terminal.loadAddon(webglAddon);
  terminal.loadAddon(tauriPtyAddon);
  terminal.loadAddon(fitAddon);
  terminal.loadAddon(unicodeAddon);
  // terminal.loadAddon(ligaturesAddon);

  await new Promise((resolve, reject) => {
    ws.addEventListener("open", () => resolve(null));
    ws.addEventListener("error", () => reject("error socket"));

    setTimeout(() => reject("Timeout"), 5000);
  }).catch(console.error);

  fitAddon.fit();

  settings$.subscribe(() => {
    setTimeout(() => {
      fitAddon.fit();
    }, 100);
  });

  ws.addEventListener("open", () => {
    fitAddon.fit();
  });

  window.addEventListener("resize", () => {
    fitAddon.fit();
  });
};

let prevAtlas: HTMLCanvasElement | null = null;

const fixFontRender = (terminal: Terminal) => {
  try {
    prevAtlas?.remove();
    const atlas = (terminal as any)._core._renderService._renderer._charAtlas;
    document.body.appendChild(atlas?._tmpCanvas);
    terminal.clearTextureAtlas();
    atlas._tmpCanvas.style.display = "none";
    prevAtlas = atlas._tmpCanvas;
  } catch (err) {
    console.log(err);
  }
};

export const createTerminal = (): Terminal => {
  const terminal = new Terminal({
    fontFamily: `${fontFamily$.getState()}, Menlo`,
    fontSize: fontSize$.getState(),
    lineHeight: lineHeight$.getState(),
    allowProposedApi: true,
    allowTransparency: true,
    customGlyphs: true,
    macOptionIsMeta: true,
    theme: currentTheme$.getState().terminal,
    // minimumContrastRatio: 20,
  });
  // terminal.options.theme.background = "transparent";

  terminal.options.theme.background = transparentize(
    1,
    terminal.options.theme.background,
  );

  currentTheme$.watch((theme) => {
    terminal.options.theme = {
      ...theme.terminal,
      background: transparentize(1, theme.terminal.background),
    };
  });
  lineHeight$.watch((value) => {
    terminal.options.lineHeight = value;
  });
  combine(fontSize$, zoomLevel$).watch(([value, zoomLevel]) => {
    terminal.options.fontSize = value * zoomLevel;
  });
  fontFamily$.watch((value) => {
    terminal.options.fontFamily = value;
  });
  zoomLevel$.watch((value) => {});

  settings$.watch(() =>
    setTimeout(() => {
      fixFontRender(terminal);
    }, 10),
  );

  setTimeout(() => {
    loadAddons(terminal);
  });

  setTimeout(() => {
    fixFontRender(terminal);
  }, 50);

  return terminal;
};
