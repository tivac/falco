YUI.add("stream-base", function(Y) {
    "use strict";
    
    var StreamBase;
    
    StreamBase = function() {
        this.publish("tweet");
    };
    
    StreamBase.prototype = {
        _create : function() {
            throw new Error("No op StreamBase._create was called");
        },
        
        start : function() {
            if(!this._stream) {
                this._create();
                
                return;
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
