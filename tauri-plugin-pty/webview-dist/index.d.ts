import type { Terminal, ITerminalAddon } from "xterm";
declare type Options = {
    buffered?: boolean;
    bidirectional?: boolean;
};
export declare class TauriPtyAddon implements ITerminalAddon {
    private socket;
    private terminal?;
    private options;
    private _attachSocketBuffer?;
    private get bidirectional();
    constructor(socket: WebSocket, options?: Options);
    private _init;
    private _setSize;
    sendData(data: string): void;
    private _flushBuffer;
    private _pushToBuffer;
    _arrayBufferToString(buf: ArrayBuffer): string;
    prevData: any;
    private _getMessage;
    deatach(): void;
    activate(terminal: Terminal): void;
    dispose(): void;
}
export {};
