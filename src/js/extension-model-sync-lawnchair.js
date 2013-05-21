YUI.add("extension-model-sync-lawnchair", function(Y) {
    
    var LawnchairSync;
    
    LawnchairSync = function() {};
    
    LawnchairSync.prototype = {
        initializer : function(config) {
            this._lawnchair = config.lawnchair || new lawnchair();
        },
        
        sync : function(action, options, done) {
            switch(action) {
                case "create":
                    this._lawnchair.save(this.toJSON, function() {
                        
                    });
                    break;
                
                case "read":
                    
                    break;
                
                case "update":
                    
                    break;
                    
                case "delete":
                    
                    break;
                    
                case default:
                    done("Unknown action: " + action);
            }
        },
        
    };
    
    Y.namespace("ModelSync").Lawnchair = LawnchairSync;
    
}, "@VERSION@", {
    requires : [
        "lawnchair"
    ]
});
