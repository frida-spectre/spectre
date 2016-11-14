/// <reference path="frida.ts"/>

export class NativeObject {
    _selfPointer: NativePointer;

    constructor(address: NativePointer) {
        this._selfPointer = address;
    }

    public isNull(): boolean {
        return (this._selfPointer == null || this._selfPointer.isNull());
    }
}