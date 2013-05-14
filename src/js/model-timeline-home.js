YUI.add("model-timeline-home", function(Y) {
    "use strict";
    
    var models  = Y.namespace("Tristis.Models"),
        streams = Y.namespace("Tristis.Streams"),
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
            this.get("tweets").add(e.tweet);
        }
    }, {
        ATTRS : {
            id : {
                value : "home"
            },
            
            name : {
                value : "Home"
            },
            
            type : {
                value : "home"
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
