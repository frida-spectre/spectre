/// <reference path="frida.ts"/>

export interface NativeSetterFunc {
    (address: NativePointer, value: any, length: number): void;
}

export function NativeSetter(offset: number, setter: NativeSetterFunc, length: number) {
    return function (value) {
        let base;

        if ('_selfPointer' in this) {
            base = this._selfPointer;
        } else {
            base = ptr(0);
            console.warn('No _selfPointer found!');
        }

        return setter(base.add(offset), value, length);
    }
}