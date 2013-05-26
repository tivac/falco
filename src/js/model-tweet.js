YUI.add("model-tweet", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        Tweet;
    
    Tweet = Y.Base.create("tweet", Y.Model, [], {
        // Sync API
        retweet : function(options, done) {
            if(!done && typeof options === "function") {
                done = options;
                options = null;
            }
            
            options || (options = {});
            
            this.sync("retweet", options, done);
        },
        
        // Sync implementation
        sync : function(action, options, done) {
            if(!Tweet.ACTIONS[action]) {
                return done("Unknown action");
            }
            
            this["_sync" + Tweet.ACTIONS[action]](options, done);
        },
        
        _syncRetweet : function(options, done) {
            tristis.twitter.post("statuses/retweet/" + this.get("id_str"), done);
        }
    }, {
        ATTRS : {
        },
        
        ACTIONS : {
            read    : "Read",
            retweet : "Retweet",
            write   : "Write"
        }
    });
    
    Y.namespace("Tristis.Models").Tweet = Tweet;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model"
    ]
});
