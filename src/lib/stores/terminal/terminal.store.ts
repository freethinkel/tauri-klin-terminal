import { transparentize } from "polished";
import { TauriPtyAddon } from "tauri-plugin-pty";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebglAddon } from "xterm-addon-webgl";
import { CanvasAddon } from "xterm-addon-canvas";
import { Unicode11Addon } from "xterm-addon-unicode11";
import { LigaturesAddon } from "xterm-addon-ligatures";
import { combine } from "effector";
import { settingsStore } from "../settings";

const loadAddons = async (terminal: Terminal) => {
  const ws = new WebSocket("ws://127.0.0.1:7703");
  const fitAddon = new FitAddon();

  const tauriPtyAddon = new TauriPtyAddon(ws);
  const webglAddon = new WebglAddon(false);
  const unicodeAddon = new Unicode11Addon();
  // const canvasAddon = new CanvasAddon();
  // canvasAddon.onAddTextureAtlasCanvas(console.log);
  // canvasAddon.onChangeTextureAtlas(console.log);
  const ligaturesAddon = new LigaturesAddon();

  terminal.loadAddon(tauriPtyAddon);
  terminal.loadAddon(fitAddon);
  terminal.loadAddon(unicodeAddon);
  terminal.loadAddon(webglAddon);
  // terminal.loadAddon(canvasAddon);
  // terminal.loadAddon(ligaturesAddon);

  await new Promise((resolve, reject) => {
    ws.addEventListener("open", () => resolve(null));
    ws.addEventListener("error", () => reject("error socket"));

    setTimeout(() => reject("Timeout"), 5000);
  }).catch(console.error);

  fitAddon.fit();

  settingsStore.settings$.subscribe(() => {
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
  if (false) {
    prevAtlas?.remove();
    const textRenderLayer = (terminal as any)._core._renderService._renderer
      ._value._renderLayers[0];
    const atlas = textRenderLayer._bitmapGenerator[0];
    document.body.appendChild(atlas?.canvas);
    const addon: CanvasAddon = (terminal as any)._addonManager._addons.find(
      (addon) => addon.instance instanceof CanvasAddon,
    )?.instance;
    console.log(addon);
    // addon?.clearTextureAtlas();

    atlas.canvas.style.fontFamily = "Iosevka Nerd Font";
    atlas.canvas.style.position = "fixed";
    atlas.canvas.style.top = 0;
    atlas.canvas.style.right = 0;
    atlas.canvas.style.transform = "scale(0.5)";
    atlas.canvas.getContext("2d").font = textRenderLayer._characterFont;
    textRenderLayer._canvas.getContext("2d").font =
      textRenderLayer._characterFont;
    terminal.clearTextureAtlas();
    textRenderLayer._canvas.getContext("2d").font =
      textRenderLayer._characterFont;
    // atlas.canvas.style.display = "none";
    prevAtlas = atlas.canvas;
  } else {
    try {
      prevAtlas?.remove();
      console.log((terminal as any)._core._renderService._renderer);
      const atlas = (terminal as any)._core._renderService._renderer._value
        ._charAtlas;
      document.body.appendChild(atlas?._tmpCanvas);
      terminal.clearTextureAtlas();
      atlas._tmpCanvas.style.display = "none";
      prevAtlas = atlas._tmpCanvas;
    } catch (err) {
      console.log(err);
    }
  }
};

export const createTerminal = (): Terminal => {
  const terminal = new Terminal({
    fontFamily: `${settingsStore.fontFamily$.getState()}, Menlo`,
    fontSize: settingsStore.fontSize$.getState(),
    fontWeight: "400",
    fontWeightBold: "500",
    lineHeight: settingsStore.lineHeight$.getState(),
    allowProposedApi: true,
    allowTransparency: true,
    customGlyphs: true,
    macOptionIsMeta: true,
    theme: settingsStore.currentTheme$.getState().terminal,
    // minimumContrastRatio: 20,
  });

  // terminal.options.theme.background = "transparent";

  terminal.options.theme.background = transparentize(
    1,
    terminal.options.theme.background,
  );

  settingsStore.currentTheme$.watch((theme) => {
    terminal.options.theme = {
      ...theme.terminal,
      background: transparentize(1, theme.terminal.background),
    };
  });
  settingsStore.lineHeight$.watch((value) => {
    terminal.options.lineHeight = value;
  });
  combine(settingsStore.fontSize$, settingsStore.zoomLevel$).watch(
    ([value, zoomLevel]) => {
      terminal.options.fontSize = value * zoomLevel;
    },
  );
  settingsStore.fontFamily$.watch((value) => {
    terminal.options.fontFamily = value;
  });

  settingsStore.zoomLevel$.watch((value) => {});

  settingsStore.settings$.watch(() =>
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
