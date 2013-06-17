YUI.add("model-list-tweets", function(Y) {
    "use strict";
    
    var tristis    = Y.namespace("Tristis"),
        models     = Y.namespace("Tristis.Models"),
        extensions = Y.namespace("Extensions"),
        
        Tweets;
    
    Tweets = Y.Base.create("tweets", Y.LazyModelList, [
        extensions.ModelListMore,
    ], {
        model   : models.Tweet,
        
        sync : function(action, options, done) {
            var args = {};
            
            if(this.size()) {
                args.since_id = this.item(0).id_str;
            }
            
            args = Y.merge(
                { count : 50 },
                this.get("config") || {},
                args
            );
            
            this.loading = true;
            
            tristis.twitter.get(this.get("api"), args, function(err, resp) {
                if(err) {
                    return done(err);
                }
                
                done(err, resp);
            });
        },
        
        // Ensure that tweets use string IDs instead of Numbers
        parse : function(response) {
            return response.map(function(tweet) {
                tweet.id = tweet.id_str;
                
                return tweet;
            });
        }
    }, {
        ATTRS : {
            api     : null,
            config  : null
        }
    });
    
    models.Tweets = Tweets;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "lazy-model-list",
        
        // Extensions
        "extension-model-list-more",
        
        // Models
        "model-tweet"
    ]
});
