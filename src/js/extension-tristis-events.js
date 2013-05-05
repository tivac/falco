YUI.add("extension-tristis-events", function(Y) {
    "use strict";
    
    var Events;
    
    Events = function() {};
    
    Events.prototype = {
        events : {
            ".external" : {
                click : "_eventExternalClick"
            }
        },
        
        // Handlers
        _eventExternalClick : function(e) {
            e.preventDefault();
            
            console.log(e.type, e.currentTarget, e);
        }
    };
    
    Y.namespace("Tristis.extensions").Events = Events;
    
}, "@VERSION@", {
    requires : [
    
    ]
});
