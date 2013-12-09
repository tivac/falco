YUI.add("model-list-tweets", function(Y) {
    "use strict";
    
    var falco      = Y.namespace("Falco"),
        models     = Y.namespace("Falco.Models"),
        extensions = Y.namespace("Extensions"),
        
        Tweets;
    
    Tweets = Y.Base.create("tweets", Y.LazyModelList, [
        extensions.ModelListMore,
    ], {
        model : models.Tweet,
        
        sync : function(action, options, done) {
            var args = Y.merge(
                    { count : 200 },
                    this.get("config") || {},
                    options
                );
            
            falco.twitter.get(this.get("api"), args, function(err, resp) {
                if(err) {
                    return done(err);
                }
                
                done(err, resp);
            });
        },
        
        // Ensure that tweets use string IDs instead of Numbers
        parse : function(response) {
            var tweets = response,
                path   = this.get("selector");
            
            if(path) {
                tweets = Y.Object.getValue(response, path);
                
                if(!tweets) {
                    this.fire("error", {
                        error    : "Invalid selector path",
                        response : response,
                        src      : "parse"
                    });
                    
                    return null;
                }
            }
            
            return tweets.map(function(tweet) {
                tweet.id = tweet.id_str;
                
                return tweet;
            });
        },
        
        // Compare using parsed Date values
        comparator : function(tweet) {
            return Date.parse(tweet.created_at);
        },
        
        // Sort in reverse chronological order
        _compare : function(a, b) {
            return this.comparator(b) - this.comparator(a);
        },
        
        // Will either load tweets below the first (not necessarily most recent, but good enough)
        // & otherwise will load  all of them if the list is empty
        backfill : function() {
            if(!this.size()) {
                return this.load();
            }
            
            this.more({
                max_id : this.item(0).id_str
            });
        }
    }, {
        ATTRS : {
            api      : null,
            config   : null,
            selector : null
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
