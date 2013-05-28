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
            var tweetsList, tweets;
            
            config || (config = {});
            
            // Since Y.Base.create isn't copying it for us...
            this.constructor.SYNCS = TimelineBase.SYNCS;
            
            debugger;
            
            tweets = config.tweets || [];
            
            tweetsList = new models.Tweets({
                items : tweets
            });
            
            this.set("tweets", tweetsList);
            
            this._handles = [
                tweetsList.after([ "more", "add" ], this._tweetAdd, this)
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
    }, {
        ATTRS : {
            tweets : {
                setter : function(value) {
                    var tweets = this.get("tweets");
                    
                    if(tweets && Array.isArray(value)) {
                        tweets.add(value);
                    }
                    
                    return tweets || value;
                }
            }
        },
        
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
