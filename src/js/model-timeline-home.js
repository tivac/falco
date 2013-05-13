YUI.add("model-timeline-home", function(Y) {
    "use strict";
    
    var models  = Y.namespace("Tristis.Models"),
        streams = Y.namespace("Tristis.Streams"),
        Home;
        
    Home = Y.Base.create("home", models.TimelineBase, [], {
        initializer : function() {
            streams.user.on("tweet", this._streamTweet, this);
            
            this.get("tweets").setAttrs({
                api : "statuses/home_timeline"
            });
        },
        
        _streamTweet : function(e) {
            console.log("User stream tweet in home timeline", e.type, e);
        }
    }, {
        ATTRS : {
            id : {
                value : "home"
            },
            
            name : {
                value : "Home"
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
