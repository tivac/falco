YUI.add("model-timeline-base", function(Y) {
    "use strict";
    
    var models = Y.namespace("Falco.Models"),
        
        TimelineBase;
        
    TimelineBase = Y.Base.create("timeline", Y.Model, [], {
        initializer : function(config) {
            var tweets;
            
            if(!config) {
                config = {};
            }
            
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
            // Don't notify for tweets from cache
            // TODO: is this ever hit?
            if(e.cached) {
                debugger;
                
                return;
            }
            
            this.fire("tweets", {
                count  : e.model ? 1 : (e.parsed || e.models).length
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
