/// <reference path="Frida.ts"/>

export interface NativeGetterFunc {
    (address: NativePointer, length: number): any;
}

export function NativeGetter(offset: number, getter: NativeGetterFunc, length: number) {
    return function () {
        let base;

        if ('selfPointer' in this) {
            base = this.selfPointer;
        } else {
            base = ptr(0);
            console.warn('No selfPointer found!');
        }

        return getter(base.add(offset), length);
    }
}