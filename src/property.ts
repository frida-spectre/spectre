/// <reference path="Frida.ts" />

import { NativeObject } from './native-object';
import { NativeGetterFunc, NativeGetter } from './native-getter';
import { NativeSetterFunc, NativeSetter } from './native-setter';
import { Primitive } from './primitives';

export function Property<T extends NativeObject>(
    offset: number,
    property_type: { new (address): T; } | Primitive,
    writable: boolean = true,
    length: number = -1): PropertyDecorator {
    return function (target: Object, key: string) {
        let getter: NativeGetterFunc;
        let setter: NativeSetterFunc;

        if (property_type instanceof Primitive) {
            getter = (<Primitive>property_type).getGetterFunc();
            setter = (<Primitive>property_type).getSetterFunc();
        } else {
            getter = (address, length) => { return new (<{ new (address): T; }>property_type)(address); }
            setter = (address, value, length) => { Memory.writePointer(address, value._selfPointer); }
        }

        if (!writable) {
            setter = (value) => { throw `Property "${key}" is read-only.` };
        }

        if (delete target[key]) {
            Object.defineProperty(target, key, {
                get: NativeGetter(offset, getter, length),
                set: NativeSetter(offset, setter, length),
                enumerable: true,
                writable: writable
            });
        }
    }
}