/// <reference path="./c2/Events/KeyboardEventParameter.ts" />
/// <reference path="./c2/EventHandler.ts" />
/// <reference path="./common/Frida.ts" />

Interceptor.attach(ptr('0x008D99A0'), {
    onEnter: function (args) {
        let eventParamAddress = ptr(args[1]);

        let keyboardEventParam = new C2.Events.KeyboardEventParameter(
            Memory.readU8(eventParamAddress.add(0x00)),
            Memory.readU32(eventParamAddress.add(0x04)),
            Memory.readU8(eventParamAddress.add(0x10))
        );

        // console.log(JSON.stringify(keyboardEventParam));
        C2.Events.EventHandler.KeyboardEventCallback(keyboardEventParam);
    }
});