YUI.add("model-timeline-base", function(Y) {
    "use strict";
    
    var models = Y.namespace("Tristis.Models"),
        syncs  = Y.namespace("ModelSync"),
        
        TimelineBase;
        
    TimelineBase = Y.Base.create("timeline", Y.Model, [
        syncs.Lawnchair,
        syncs.Twitter,
        syncs.Multi
    ], {
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
            
            this.save({ sync : "lawnchair" });
        },
        
        // Make sure that tweets are added to the child list correctly
        parse : function(response) {
            if(!response.tweets) {
                return response;
            }
            
            this.get("tweets").add(response.tweets, { cached : true });
            
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
                count = (e.response || e.models).lenth;
            }
            
            this.fire("tweets", {
                count : count
            });
        }
    }, {
        SYNCS : {
            lawnchair : syncs.Lawnchair,
            twitter   : syncs.Twitter
        }
    });
    
    models.TimelineBase = TimelineBase;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model",
        
        // Models
        "model-list-tweets",
        
        // Sync Layers
        "model-sync-lawnchair",
        "model-sync-twitter",
        "gallery-model-sync-multi"
    ]
});
