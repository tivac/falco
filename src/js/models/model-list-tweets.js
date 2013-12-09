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
            return b - a;
        },
        
        // Will either load all tweets if list is empty or
        // load tweets below the oldest existing one
        backfill : function() {
            var items;
            
            if(!this.size()) {
                return this.load();
            }
            
            items = this.toArray();
            items = items.sort(function(a, b) {
                return this._compare(this.comparator(a), this.comparator(b));
            }.bind(this));
            
            this.more({
                // Only tweets prior to the earliest one in our list
                max_id : items[items.length - 1].id_str,
                // Insert them at the end so it doesn't jump around weirdly
                index  : this.size()
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
