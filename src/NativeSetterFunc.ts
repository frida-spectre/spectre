/// <reference path="Frida.ts"/>

export interface NativeSetterFunc {
    (address: NativePointer, value: any, length: number): void;
}

export function NativeSetter(offset: number, setter: NativeSetterFunc, length: number) {
    return function (value) {
        let base;

        if ('selfPointer' in this) {
            base = this.selfPointer;
        } else {
            base = ptr(0);
            console.warn('No selfPointer found!');
        }

        return setter(base.add(offset), value, length);
    }
}