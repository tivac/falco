YUI.add("model-sync-twitter", function(Y) {
    "use strict";
    
    var TwitterSync;
    
    TwitterSync = function() {};
    
    TwitterSync.prototype = {
        serialize : function() {
            return this.toJSON();
        },
        
        sync : function(action, options, done) {
            var fn = "_twitter" + action[0].toUpperCase() + action.slice(1);
            
            if(fn in this) {
                return this[fn](options, done);
            }
            
            done("Unknown action: " + action);
        }
    };
    
    Y.namespace("ModelSync").Twitter = TwitterSync;
});
