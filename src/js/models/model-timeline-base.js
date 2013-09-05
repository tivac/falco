YUI.add("model-timeline-base", function(Y) {
    "use strict";
    
    var models = Y.namespace("Tristis.Models"),
        syncs  = Y.namespace("ModelSync"),
        
        TimelineBase;
        
    TimelineBase = Y.Base.create("timeline", Y.Model, [], {
        initializer : function(config) {
            var tweets;
            
            config || (config = {});
            
            // Since Y.Base.create isn't copying it for us...
            this.constructor.SYNCS = TimelineBase.SYNCS;
            
            tweets = new models.Tweets({
                items : config.tweets || []
            });
            
            this.set("tweets", tweets);
            
            this._handles = [
                tweets.after([ "more", "add" ], this._tweetAdd, this)
            ];
            
            this.publish("tweets", { preventable : false });
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = null;
            
            this.get("tweets").destroy();
        },
        
        // Make sure that tweets are added to the child list correctly
        parse : function(response) {
            var tweets;
            
            if(!response.tweets) {
                return response;
            }
            
            tweets = this.get("tweets");
            
            if(!tweets.size()) {
                tweets.reset(response.tweets);
            } else {
                // Force new tweets to be added to the top of the list.
                // When this is re-loaded later from the persistence layer
                // they'll be sorted into the right spot
                tweets.add(response.tweets, { cached : true, index : 0 });
            }
            
            delete response.tweets;
            
            return response;
        },
        
        // Override .toJSON() to make sure tweets are included
        toJSON : function() {
            var json = TimelineBase.superclass.toJSON.apply(this);
            
            json.tweets = json.tweets.toJSON();
            
            return json;
        },
        
        _tweetAdd : function(e) {
            var count = 1;
            
            // Don't notify for tweets from cache
            if(e.cached) {
                return;
            }
            
            if(e.response || e.models) {
                count = (e.response || e.models).length;
            }
            
            this.fire("tweets", {
                count : count
            });
        }
    });
    
    models.TimelineBase = TimelineBase;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model",
        
        // Models
        "model-list-tweets"
    ]
});
