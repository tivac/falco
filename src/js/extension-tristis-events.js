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
        
        // Handlers
        _eventExternalClick : function(e) {
            e.preventDefault();
            
            gui.Shell.openExternal(e.currentTarget.get("href"));
        }
    };
    
    Y.namespace("Tristis.Extensions").Events = Events;
    
}, "@VERSION@", {
    requires : [
    
    ]
});
