import type { Terminal, ITerminalAddon } from "xterm";

type Options = {
  buffered?: boolean;
  bidirectional?: boolean;
};

export class TauriPtyAddon implements ITerminalAddon {
  private socket: WebSocket;
  private terminal?: Terminal;
  private options: Options;
  private _attachSocketBuffer?: string | null;
  private get bidirectional(): boolean {
    return typeof this.options?.bidirectional === "undefined"
      ? true
      : this.options?.bidirectional;
  }

  constructor(socket: WebSocket, options?: Options) {
    this.socket = socket;
    this.socket.binaryType = "arraybuffer";
    this.options = options || {};
  }
  private _init() {
    this.socket.addEventListener("message", (data) => this._getMessage(data));
    if (this.bidirectional) {
      this.terminal!.onData((data: string) => this.sendData(data));
    }
    this.terminal!.onResize((data: { cols: number; rows: number }) =>
      this._setSize(data)
    );
    this.socket.addEventListener("close", () => this.deatach());
    this.socket.addEventListener("error", () => this.deatach());
  }

  private _setSize({ cols, rows }: { rows: number; cols: number }) {
    const data = new TextEncoder().encode(
      "\x01" + JSON.stringify({ cols, rows })
    );
    this.socket.send(data);
  }

  sendData(data: string) {
    this.socket.send(new TextEncoder().encode("\x00" + data));
  }

  private _flushBuffer() {
    this.terminal!.write(this._attachSocketBuffer ?? "");
    this._attachSocketBuffer = null;
  }

  private _pushToBuffer(data: string) {
    if (this._attachSocketBuffer) {
      this._attachSocketBuffer += data;
    } else {
      this._attachSocketBuffer = data;
      setTimeout(() => this._flushBuffer(), 10);
    }
  }

  _arrayBufferToString(buf: ArrayBuffer) {
    return String.fromCharCode.apply("", new Uint8Array(buf) as any);
  }

  prevData: any = null;
  private async _getMessage(ev: MessageEvent): Promise<void> {
    try {
      // const bytes = new Uint8Array(ev.data);

      const data = ev.data;
      // const data = new TextDecoder().decode(ev.data);

      if (this.options!.buffered) {
        this._pushToBuffer(data);
      } else {
        this.terminal!.write(data);
      }
      this.prevData = ev.data;
    } catch (err) {
      console.log(err);
    }
  }

  deatach() {
    // const addonTerminal = <ITerminadoAddonTerminal>term;
    // addonTerminal.__dataListener.dispose();
    // addonTerminal.__dataListener = undefined;
    // socket = typeof socket === "undefined" ? addonTerminal.__socket : socket;
    // if (socket) {
    //   socket.removeEventListener("message", addonTerminal.__getMessage);
    // }
    // delete addonTerminal.__socket;
  }

  activate(terminal: Terminal): void {
    this.terminal = terminal;
    this._init();
  }
  dispose(): void {
    throw new Error("Method not implemented.");
  }
}
