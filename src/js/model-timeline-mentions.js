YUI.add("model-timeline-mentions", function(Y) {
    "use strict";
    
    var models  = Y.namespace("Tristis.Models"),
        streams = Y.namespace("Tristis.Streams"),
        Mentions;
        
    Mentions = Y.Base.create("mentions", models.TimelineBase, [], {
        initializer : function() {
            this._handles.push(
                streams.user.on("tweet", this._streamTweet, this)
            );
            
            this.get("tweets").setAttrs({
                api : "statuses/mentions_timeline"
            });
        },
        
        _streamTweet : function(e) {
            var mentions = e.tweet.entities.user_mentions,
                id       = models.user.get("id_str"),
                mentioned;
            
            if(!mentions || !mentions.length) {
                return;
            }
            
            mentioned = mentions.some(function(mention) {
                return mention.id_str === id;
            });
            
            if(!mentioned) {
                return;
            }
            
            this.get("tweets").add(e.tweet, { index : 0 });
        }
    }, {
        ATTRS : {
            id : {
                value : "mentions"
            },
            
            name : {
                value : "Mentions"
            },
            
            type : {
                value : "mentions"
            },
            
            url : {
                value : "/mentions"
            }
        }
    });
    
    models.Mentions = Mentions;
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-timeline-base"
    ]
});
