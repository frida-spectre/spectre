/// <reference path="Frida.ts" />

import { NativeObject } from './NativeObject';
import { NativeGetterFunc, NativeGetter } from './NativeGetterFunc';
import { NativeSetterFunc, NativeSetter } from './NativeSetterFunc';
import { Primitive } from './Primitives';

export function property<T extends NativeObject>(
    offset: number,
    type: { new (address): T; } | Primitive,
    writable: boolean = true,
    length: number = -1): PropertyDecorator {
    return function (target: Object, key: string) {
        let getter: NativeGetterFunc;
        let setter: NativeSetterFunc;

        if (type instanceof Primitive) {
            getter = (<Primitive>type).getGetterFunc();
            setter = (<Primitive>type).getSetterFunc();
        } else {
            getter = (address, length) => { return new (<{ new (address): T; }>type)(address); }
            setter = (address, value, length) => { Memory.writePointer(address, value.selfPointer); }
        }

        if (!writable) {
            setter = (value) => { throw `Property "${key}" is read-only.` };
        }

        if (delete target[key]) {
            Object.defineProperty(target, key, {
                get: NativeGetter(offset, getter, length),
                set: NativeSetter(offset, setter, length),
                enumerable: true
            });
        }
    }
}