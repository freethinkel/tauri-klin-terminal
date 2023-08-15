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
    private _sendData;
    private _flushBuffer;
    private _pushToBuffer;
    private _getMessage;
    deatach(): void;
    activate(terminal: Terminal): void;
    dispose(): void;
}
export {};
