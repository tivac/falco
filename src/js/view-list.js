YUI.add("view-list", function(Y) {
    "use strict";
    
    var templates = Y.namespace("Tristis.Templates"),
        List;
    
    List = Y.Base.create("timeline", Y.View, [], {
        template : templates.timeline,
        
        initializer : function() {
            var list = this.get("model");
            
            this._handles = [
                list.get("tweets").after([ "reset", "more" ], this._renderTweets, this)
            ];
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = this._rendered = null;
        },
        
        render : function() {
            this.get("container").setHTML(
                this.template(
                    Y.merge(this.get("model").toJSON(), {
                        _t : {
                            tweet : templates.tweet
                        }
                    })
                )
            );
            
            this._rendered = true;
            
            return this;
        },
        
        _renderTweets : function(e) {
            console.log(e.type, e);
            
            // Render first if necessary
            if(!this._rendered) {
                this.render();
            }
            
            this.get("container").one("ol").prepend(
                e.response.reduce(function(prev, curr) {
                    return prev + templates.tweet(curr);
                }, "")
            );
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
