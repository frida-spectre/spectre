/// <reference path="frida.ts"/>

export interface NativeGetterFunc {
    (address: NativePointer, length: number): any;
}

export function NativeGetter(offset: number, getter: NativeGetterFunc, length: number) {
    return function () {
        let base;

        if ('_selfPointer' in this._selfPointer) {
            base = this._selfPointer;
        } else {
            base = ptr(0);
            console.warn('No _selfPointer found!');
        }

        return getter(base.add(offset), length);
    }
}