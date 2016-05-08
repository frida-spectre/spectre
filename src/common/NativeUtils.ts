/// <reference path="./Frida.ts" />
/// <reference path="./NativeObject.ts" />
function native<T extends NativeObject>(
    offset: number, 
    type: string | { new (address): T; }, 
    writable: boolean = true, 
    length: number = -1) : PropertyDecorator {
    return function (target: Object, key: string) {
        let getter = NativeGetter(offset, type, length);
        let setter = writable ? NativeSetter(offset, type, length) : (value) => {throw `Property "${key}" is read-only.`}; 

        // function getter() {
        //     return value;
        // }

        // function setter(newValue) {
        //     if (newValue <= 90) newValue += 10;
        //     value = newValue;
        // }

        if (delete this[key]) {
            Object.defineProperty(target, key, {
                get: getter,
                set: setter
            });
        }
    }
}

function NativeGetter(offset: number, type: any, length: number) {
    let readers = {
        'unknown32':    Memory.readU32,
        'unknown16':    Memory.readU16,
        'unknown8':     Memory.readU8,
        'pointer':      Memory.readPointer,
        'bool8':        Memory.readU8,
        'bool32':       Memory.readU32,
        'int8':         Memory.readS8,
        'uint8':        Memory.readU8,
        'int16':        Memory.readS16,
        'uint16':       Memory.readU16,
        'int32':        Memory.readS32,
        'uint32':       Memory.readU32,
        'int64':        Memory.readS64,
        'uint64':       Memory.readU64,
        'float':        Memory.readFloat,
        'double':       Memory.readDouble,
        'string':       Memory.readCString, // Reads string from pointer
    }
    
    let converter = function (value) {
        return value;
    };

    if (typeof type != 'string') {
        converter = function (value) {
            return new type(value);
        }
        type = 'pointer';
    }

    if (!(type in readers)) {
        throw 'No getter exists for type:' + type;
    }

    let getter = readers[type];

    return function() {
        let base;
        
        if ('selfPointer' in this) {
            base = this.selfPointer;
        } else {
            base = ptr(0);
        }
      
        let value;
        if (type.startsWith('string')) {
            value = getter(base.add(offset), length);
        } else {
            value = getter(base.add(offset));
        }

        if (type.startsWith('bool')) {
            return value == 1;
        }

        return converter(value);
    }
}

function NativeSetter(offset, type, length) {
    let writers = {
        'unknown32':    Memory.writeU32,
        'unknown16':    Memory.writeU16,
        'unknown8':     Memory.writeU8,
        'pointer':      Memory.writePointer,
        'bool8':        Memory.writeU8,
        'bool32':       Memory.writeU32,
        'int8':         Memory.writeS8,
        'uint8':        Memory.writeU8,
        'int16':        Memory.writeS16,
        'uint16':       Memory.writeU16,
        'int32':        Memory.writeS32,
        'uint32':       Memory.writeU32,
        'int64':        Memory.writeS64,
        'uint64':       Memory.writeU64,
        'float':        Memory.writeFloat,
        'double':       Memory.writeDouble,
        'string':       Memory.writeCString,
    }
    
    let converter = (value) => {
        return value;
    };

    if (typeof type === 'function') {
        converter = (value) => {
            return value.selfPointer;
        }

        type = 'pointer';
    }
    
    
    if (!(type in writers)) {
        throw 'No setter exists for type:' + type;
    }
    
    let setter = writers[type];
    
    return function(value) {
        let base;
        
        if ('selfPointer' in this) {
            base = this.selfPointer;
        } else {
            base = ptr(0);
        }
        
        value = converter(value);
        
        if (type.startsWith('bool')) {
            value = value ? 1 : 0;
        }
        
        if (type.startsWith('string')) {
            setter(base.add(offset), value, length);
        } else {
            setter(base.add(offset), value);   
        }
    }
}