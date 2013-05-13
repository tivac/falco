YUI.add("model-timeline-base", function(Y) {
    "use strict";
    
    var models = Y.namespace("Tristis.Models"),
        TimelineBase;
        
    TimelineBase = Y.Base.create("timeline", Y.Model, [], {
        initializer : function() {
            var tweets;
            
            tweets = new models.Tweets();
            
            this.set("tweets", tweets);
            
            this._handles = [
                tweets.after([ "more", "add" ], this._tweetAdd, this)
            ];
            
            this.publish("tweets", { preventable : false });
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = null;
        },
        
        // Override .toJSON() to make sure tweets are included
        toJSON : function() {
            var json = TimelineBase.superclass.toJSON.apply(this);
            
            json.tweets = json.tweets.toJSON();
            
            return json;
        },
        
        _tweetAdd : function(e) {
            var count = 1;
            
            if(e.response || e.models) {
                count = (e.response || e.models).lenth;
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
