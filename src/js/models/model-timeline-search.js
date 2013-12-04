YUI.add("model-timeline-search", function(Y) {
    "use strict";
    
    var models  = Y.namespace("Falco.Models"),
        
        Search;
        
    Search = Y.Base.create("list", models.TimelineBase, [], {
        initializer : function() {
            this._handles.push(
                this.get("tweets").after([ "load", "more" ], this.poll, this)
            );
            
            this.get("tweets").setAttrs({
                selector : "statuses",
                api      : "search/tweets",
                
                config : {
                    q     : this.get("query"),
                    count : 100
                }
            });
            
            this.set("url", "/searches/" + this.get("id"));
            
            // Searches load (& start polling) immediately
            this.get("tweets").load();
        },
        
        poll : function() {
            if(this._timer) {
                this._timer.cancel();
            }
            
            this._timer = Y.later(60000, this, function() {
                this.get("tweets").more();
            });
        }
    }, {
        ATTRS : {
            type : {
                value : "search"
            },
            
            query : {
                value : ""
            }
        }
    });
    
    models.Search = Search;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-timeline-base"
    ]
});
