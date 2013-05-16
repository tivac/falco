YUI.add("view-timeline", function(Y) {
    "use strict";
    
    var tristis   = Y.namespace("Tristis"),
        templates = Y.namespace("Tristis.Templates"),
        options, Timeline;
    
    options = {
        "data-external" : ""
    };
    
    Timeline = Y.Base.create("timeline", Y.View, [], {
        template : templates.timeline,
        
        initializer : function() {
            var model = this.get("model");
            
            this._handles = [
                model.after("reset", this.render, this),
                model.get("tweets").after([ "reset", "add" ], this._renderUpdate, this)
            ];
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = null;
        },
        
        render : function() {
            var timeline = this.get("model").toJSON();
            
            timeline.tweets = timeline.tweets.map(this._tweetTransform);
            
            this.get("container").setHTML(
                this.template(
                    Y.merge(
                        timeline,
                        { _t : templates }
                    )
                )
            );
            
            this.rendered = true;
            
            return this;
        },
        
        _renderUpdate : function(e) {
            var self = this,
                models;
            
            if(!this.rendered) {
                return this.render();
            }
            
            models = e.models ? e.models : [ e.model ];
            
            this.get("container").one("ol").prepend(
                models.reduce(function(prev, curr) {
                    curr = self._tweetTransform(curr);
                    
                    return prev + templates.tweet(curr);
                }, "")
            );
        },
        
        _tweetTransform : function(tweet) {
            tweet.html = tristis.txt.autoLinkWithJSON(tweet.text, tweet.entities, options);
            
            return tweet;
        }
    });
    
    Y.namespace("Tristis.Views").Timeline = Timeline;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Templates
        "template-timeline",
        "template-tweet"
    ]
});
