YUI.add("view-list", function(Y) {
    "use strict";
    
    var templates = Y.namespace("Tristis.Templates"),
        List;
    
    List = Y.Base.create("timeline", Y.View, [], {
        template : templates.timeline,
        
        initializer : function() {
            var list = this.get("model");
            
            this._handles = [
                list.get("tweets").after([ "reset", "more", "add" ], this._renderTweets, this)
            ];
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = this._rendered = null;
        },
        
        render : function() {
            this.get("container").setHTML(
                this.template(
                    Y.merge(
                        this.get("model").toJSON(),
                        {
                            _t : {
                                tweet : templates.tweet
                            }
                        }
                    )
                )
            );
            
            this._rendered = true;
            
            return this;
        },
        
        _renderTweets : function(e) {
            var models,
                list;
            
            // Render first if necessary
            if(!this._rendered) {
                this.render();
            }
            
            // Handle results from "reset"/"more"/"add" events
            models = e.models || e.response || [ e.model ];
            
            list = this.get("container").one("ol");
            
            list.prepend(
                models.reduce(function tweetTemplates(prev, curr) {
                    return prev + templates.tweet(curr);
                }, "")
            );
            
            // TODO: Update timestamps for the rest of the tweets
            // TODO: How to approach that? DOM? ModelList? Dunno yet.
        }
    });
    
    Y.namespace("Tristis.Views").List = List;
    
}, "@VERSION", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Templates
        "template-timeline",
        "template-tweet"
    ]
});
