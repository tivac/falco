YUI.add("view-timeline", function(Y) {
    "use strict";
    
    var models    = Y.namespace("Tristis.Models"),
        templates = Y.namespace("Tristis.Templates"),
        Timeline;
    
    Timeline = Y.Base.create("timeline", Y.View, [], {
        template : templates.timeline,
        
        initializer : function() {
            this._handles = [
                models.timeline.after("add", this._renderUpdate, this)
            ];
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = null;
        },
        
        render : function() {
            this.get("container").setHTML(
                this.template({
                    tweets : models.timeline.toJSON(),
                    
                    _t : {
                        tweet : templates.tweet
                    }
                })
            );
            
            this.rendered = true;
            
            return this;
        },
        
        _renderUpdate : function(e) {
            if(!this.rendered) {
                return this.render();
            }
            
            this.get("container").one("ol").prepend(
                templates.tweet(e.model)
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
