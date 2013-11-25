YUI.add("stream-base", function(Y) {
    "use strict";
    
    var StreamBase;
    
    StreamBase = function() {
        this.publish("tweet", {
            preventable : false
        });
    };
    
    StreamBase.prototype = {
        _stream : null,
        
        start : function() {
            if(!this._stream) {
                return this._create();
            }
           
            this._stream.start();
        },
        
        stop : function() {
            if(!this._stream) {
                return;
            }
            
            this._stream.stop();
        }
    };
    
    Y.augment(StreamBase, Y.EventTarget, true, null, {
        preventable : false
    });
    
    Y.namespace("Falco.Streams").Base = StreamBase;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "oop",
        "event-custom"
    ]
});
