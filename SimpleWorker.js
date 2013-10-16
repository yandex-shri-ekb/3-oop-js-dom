"use strict";

var SimpleWorker = function(file, onMessage) {
    var _w = this.worker = new Worker(file);

    var _defs = {};

    _w.onmessage = function (oEvent) {
        var o = JSON.parse(oEvent.data);

        //console.info(o);

        if(o.id !== undefined && o.id && _defs[o.id] !== undefined) {
            var def = _defs[o.id];
            delete(_defs[o.id]);
            def.resolve(o.data);
        }

        if(o.message !== undefined) {
            console.log(o.message);
        }
        else if(o.error !== undefined) {
            console.error(o.error);
        }
        else if(onMessage) {
            onMessage.call(null, o);
        }
    };

    _w.onerror = function(event) {
        throw new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");
    };

    /**
     * @param {object} o
     */
    this.send = function(o) {
        var def = $.Deferred();
        o.id = generateToken();

        _defs[o.id] = def;

        _w.postMessage(JSON.stringify(o));

        return def.promise();
    };

    function generateToken() {
        return Math.random().toString(36).slice(2);
    }
};