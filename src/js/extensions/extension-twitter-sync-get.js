YUI.add("extension-twitter-sync-get", function(Y) {
    "use strict";
    
    var falco = Y.namespace("Falco"),
    
        TwitterSyncGet;
    
    TwitterSyncGet = function() {};
    
    TwitterSyncGet.prototype = {
        sync : function(action, options, done) {
            var api = this.get("api");
            
            if(!api) {
                return done("No API defined");
            }
            
            if(action !== "read") {
                return done("Unsupported action");
            }
            
            falco.twitter.get(api, done);
        }
    };
    
    Y.namespace("Falco.Extensions").TwitterSyncGet = TwitterSyncGet;
});
