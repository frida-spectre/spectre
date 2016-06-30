/// <reference path="./Frida.d.ts" />

import {NativeGetterFunc} from './NativeGetterFunc';
import {NativeSetterFunc} from './NativeSetterFunc';

export abstract class Primitive {
    abstract getGetterFunc(): NativeGetterFunc;
    abstract getSetterFunc(): NativeSetterFunc;
}

class SimplePrimitive extends Primitive {
    getterFunc: any;
    setterFunc: any;

    constructor(getterFunc, setterFunc) {
        super();
            this.getterFunc = getterFunc;
            this.setterFunc = setterFunc; 
    }
    public getGetterFunc(): NativeGetterFunc {
        return (address: NativePointer, length: number) => {
            return this.getterFunc(address, length);
        }
    }
    public getSetterFunc(): NativeSetterFunc {
        return (address: NativePointer, value: any, length: number) => {
            return this.setterFunc(address, value, length);
        }
    }
}

export var POINTER: Primitive = new SimplePrimitive(Memory.readPointer, Memory.writePointer);

export var FLOAT: Primitive = new SimplePrimitive(Memory.readFloat, Memory.writeFloat);
export var DOUBLE: Primitive = new SimplePrimitive(Memory.readDouble, Memory.writeDouble);

export var INT8: Primitive = new SimplePrimitive(Memory.readS8, Memory.writeS8);
export var UINT8 : Primitive = new SimplePrimitive(Memory.readU8, Memory.writeU8);
export var INT16: Primitive = new SimplePrimitive(Memory.readS16, Memory.writeS16);
export var UINT16 : Primitive = new SimplePrimitive(Memory.readU16, Memory.writeU16);
export var INT32: Primitive = new SimplePrimitive(Memory.readS32, Memory.writeS32);
export var UINT32 : Primitive = new SimplePrimitive(Memory.readU32, Memory.writeU32);
export var BOOL8 : Primitive = new SimplePrimitive(Memory.readU8, Memory.writeU8);

export var UNKNOWN8 : Primitive = new SimplePrimitive(Memory.readU8, Memory.writeU8);
export var UNKNOWN16 : Primitive = new SimplePrimitive(Memory.readU16, Memory.writeU16);
export var UNKNOWN32 : Primitive = new SimplePrimitive(Memory.readU32, Memory.writeU32);

export var PSTRING_UTF8 : Primitive = new SimplePrimitive(
    (pointer, length = -1) => {
        return Memory.readUtf8String(pointer, length);
    }, (pointer, value, length = -1) => {
        Memory.writePointer(pointer, Memory.allocUtf8String(value.substring(0, length)));
    });