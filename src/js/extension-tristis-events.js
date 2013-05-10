YUI.add("extension-tristis-events", function(Y) {
    "use strict";
    
    var gui = require("nw.gui"),
        Events;
    
    Events = function() {};
    Events.prototype = {
        events : {
            "[data-external]" : {
                click : "_eventExternalClick"
            }
        },
        
        initializer : function() {
            this._handles = [
                this.on("*:linked", this._linkedEvent, this),
                this.on("*:link"  , this._linkEvent,    this)
            ];
        },
        
        // DOM events
        _eventExternalClick : function(e) {
            e.preventDefault();
            
            gui.Shell.openExternal(e.currentTarget.get("href"));
        },
        
        // YUI events
        
        // TODO: more?
        _linkedEvent : function() {
            this._setup();
        },
        
        _linkEvent : function(e) {
            console.log(e.type, e);
            
            this.navigate(e.url);
        }
    };
    
    Y.namespace("Tristis.Extensions").Events = Events;
    
}, "@VERSION@", {
    requires : [
    
    ]
});
