YUI.add("model-timeline-home", function(Y) {
    "use strict";
    
    var models  = Y.namespace("Falco.Models"),
        streams = Y.namespace("Falco.Streams"),
        Home;
        
    Home = Y.Base.create("home", models.TimelineBase, [], {
        initializer : function() {
            this._handles.push(
                streams.user.on("tweet", this._streamTweet, this)
            );
            
            this.get("tweets").setAttrs({
                api : "statuses/home_timeline"
            });
        },
        
        _streamTweet : function(e) {
            // Only allow friend's tweets to show here
            var user = models.friends.getById(e.tweet.user.id);
            
            if(!user) {
                return;
            }
            
            this.get("tweets").add(e.tweet, { index : 0 });
        }
    }, {
        ATTRS : {
            id : {
                value : "home"
            },
            
            name : {
                value : "Home"
            },
            
            slug : {
                value : "home"
            },
            
            type : {
                value : "base"
            },
            
            url  : {
                value : "/lists/home"
            }
        }
    });
    
    models.Home = Home;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-timeline-base",
        
        // Streams
        "stream-user"
    ]
});
