YUI.add("view-timeline", function(Y) {
    "use strict";
    
    var models    = Y.namespace("Tristis.Models"),
        templates = Y.namespace("Tristis.Templates"),
        Timeline;
    
    Timeline = Y.Base.create("timeline", Y.View, [], {
        template : templates.timeline,
        
        initializer : function() {
            this._handles = [
                this.get("model").after([ "reset", "add" ], this._renderUpdate, this)
            ];
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = null;
        },
        
        render : function() {
            this.get("container").setHTML(
                this.template({
                    tweets : this.get("model").toJSON(),
                    
                    _t : {
                        tweet : templates.tweet
                    }
                })
            );
            
            this.rendered = true;
            
            return this;
        },
        
        _renderUpdate : function(e) {
            var models;
            
            if(!this.rendered) {
                return this.render();
            }
            
            models = e.models ? e.models : [ e.model ];
            
            this.get("container").one("ol").prepend(
                models.reduce(function(prev, curr) {
                    return prev + templates.tweet(curr);
                }, "")
            );
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
