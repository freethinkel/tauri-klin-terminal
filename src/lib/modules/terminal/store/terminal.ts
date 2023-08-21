import { settings$ } from "@/modules/settings/store";
import { transparentize } from "polished";
import { TauriPtyAddon } from "tauri-plugin-pty";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { LigaturesAddon } from "xterm-addon-ligatures";
import { WebglAddon } from "xterm-addon-webgl";

const loadAddons = async (terminal: Terminal) => {
  const ws = new WebSocket("ws://localhost:8080/websocket");
  const fitAddon = new FitAddon();

  const tauriPtyAddon = new TauriPtyAddon(ws);
  const webglAddon = new WebglAddon(false);
  const ligaturesAddon = new LigaturesAddon();

  terminal.loadAddon(webglAddon);
  terminal.loadAddon(tauriPtyAddon);
  terminal.loadAddon(fitAddon);
  terminal.loadAddon(ligaturesAddon);

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
  prevAtlas?.remove();
  const atlas = (terminal as any)._core._renderService._renderer._charAtlas;
  document.body.appendChild(atlas?._tmpCanvas);
  terminal.clearTextureAtlas();
  atlas._tmpCanvas.style.display = "none";
  prevAtlas = atlas._tmpCanvas;
};

export const createTerminal = (): Terminal => {
  const terminal = new Terminal({
    fontFamily: `${settings$.fontFamily.get()}, Menlo`,
    fontSize: settings$.fontSize.get(),
    lineHeight: settings$.lineHeight.get(),
    allowProposedApi: true,
    allowTransparency: true,
    customGlyphs: true,
    theme: settings$.currentTheme.get().terminal,
  });

  terminal.options.theme.background = transparentize(
    1,
    terminal.options.theme.background
  );

  settings$.currentTheme.listen((theme) => {
    terminal.options.theme = {
      ...theme.terminal,
      background: transparentize(1, theme.terminal.background),
    };
    // setTimeout(() => {
    //   terminal.options.theme.background = transparentize(
    //     1,
    //     theme.terminal.background
    //   );
    // }, 10);
  });
  settings$.lineHeight.listen((value) => {
    terminal.options.lineHeight = value;
  });
  settings$.fontSize.listen((value) => {
    terminal.options.fontSize = value;
  });
  settings$.fontFamily.listen((value) => {
    terminal.options.fontFamily = value;
  });

  settings$.listen(() =>
    setTimeout(() => {
      fixFontRender(terminal);
    }, 10)
  );

  setTimeout(() => {
    loadAddons(terminal);
  });

  setTimeout(() => {
    fixFontRender(terminal);
  }, 50);

  return terminal;
};
