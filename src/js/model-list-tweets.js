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
        
        loading : false,
        loaded  : false,
        
        sync : function(action, options, done) {
            var self = this,
                args = {};
            
            if(action === "more") {
                if(this.size()) {
                    args.since_id = this.item(0).id_str;
                }
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
                
                self.loaded = true;
                self.loading = false;
                
                // TODO: ensure we don't add dupe tweets somehow
                done(err, resp);
            });
        },
        
        // Ensure that tweets use string IDs instead of Numbers
        parse : function(response) {
            return response.map(function(tweet) {
                tweet.id = tweet.id_str;
                
                return tweet;
            });
        },
        
        // Override toJSON so we always return most-recently-added tweets first
        // We explicitly DO NOT sort the list
        toJSON : function() {
            var data = this.toArray(),
                left, right, temp;
            
            // http://jsperf.com/js-array-reverse-vs-while-loop/9
            for(left = 0, right = data.length - 1; left < right; left += 1, right -= 1) {
                temp        = data[left];
                data[left]  = data[right];
                data[right] = temp;
            }
            
            return data;
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
