YUI.add("model-timeline-search", function(Y) {
    "use strict";
    
    var models  = Y.namespace("Falco.Models"),
        
        Search;
        
    Search = Y.Base.create("list", models.TimelineBase, [], {
        initializer : function(config) {
            config || (config = {});
            
            this._handles.push(
                this.get("tweets").after("load", this._poll, this)
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
        },
        
        _poll : function() {
            Y.later(30000, this, function() {
                this.get("tweets").more(this._poll.bind(this));
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
