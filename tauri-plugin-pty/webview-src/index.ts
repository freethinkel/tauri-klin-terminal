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
    this.options = options || {};
  }
  private _init() {
    this.socket.addEventListener("message", (data) => this._getMessage(data));
    if (this.bidirectional) {
      this.terminal!.onData((data: string) => this._sendData(data));
    }
    this.terminal!.onResize((data: { cols: number; rows: number }) =>
      this._setSize(data)
    );
    this.socket.addEventListener("close", () => this.deatach());
    this.socket.addEventListener("error", () => this.deatach());
  }

  private _setSize(size: { rows: number; cols: number }) {
    this.socket.send(JSON.stringify(["set_size", size.rows, size.cols]));
  }

  private _sendData(data: string) {
    this.socket.send(JSON.stringify(["stdin", data]));
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

  private _getMessage(ev: MessageEvent) {
    const data = JSON.parse(ev.data);
    if (data[0] === "stdout") {
      if (this.options!.buffered) {
        this._pushToBuffer(data[1]);
      } else {
        this.terminal!.write(data[1]);
      }
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
