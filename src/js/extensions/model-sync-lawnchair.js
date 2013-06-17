YUI.add("model-sync-lawnchair", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        LawnchairSync;
    
    LawnchairSync = function() {};
    
    LawnchairSync.prototype = {
        
        initializer : function() {
            var self = this;
            
            this._lawnchairKey = Y.cached(function() {
                return self.get("name") + ":" + self.get("id");
            });
        },
        
        serialize : function() {
            return this.toJSON();
        },
        
        sync : function(action, options, done) {
            done || (done = function() {});
            
            if(action === "create" || action === "update") {
                return this._lawnchairSave(done);
            }
            
            if(action === "read") {
                return this._lawnchairRead(done);
            }
            
            if(action === "delete") {
                return this._lawnchairDelete(done);
            }
            
            done("Unknown action: " + action);
        },
        
        _lawnchairSave : function(done) {
            tristis.lawnchair.save({
                key  : this._lawnchairKey(),
                data : this.serialize()
            }, function() {
                done();
            });
        },
        
        _lawnchairRead : function(done) {
            var key  = this._lawnchairKey();
            
            tristis.lawnchair.exists(key, function(exists) {
                if(!exists) {
                    return done("Unknown key: " + key);
                }
                
                tristis.lawnchair.get(key, function(obj) {
                    done(null, obj.data);
                });
            });
        },
        
        _lawnchairDelete : function(done) {
            var key  = this._lawnchairKey();
            
            tristis.lawnchair.exists(key, function(exists) {
                if(!exists) {
                    return done("Unknown key: " + key);
                }
                
                tristis.lawnchair.remove(key, function() {
                    done();
                });
            });
        }
    };
    
    Y.namespace("ModelSync").Lawnchair = LawnchairSync;
    
}, "@VERSION@", {
    requires : [
        // lawnchair
        "external-lawnchair"
    ]
});
