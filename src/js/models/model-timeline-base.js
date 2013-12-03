YUI.add("model-timeline-base", function(Y) {
    "use strict";
    
    var models = Y.namespace("Falco.Models"),
        
        TimelineBase;
        
    TimelineBase = Y.Base.create("timeline", Y.Model, [], {
        initializer : function(config) {
            var tweets;
            
            config || (config = {});
            
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
            
            if(e.parsed || e.models) {
                count = (e.parsed || e.models).length;
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
