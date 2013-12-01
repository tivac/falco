YUI.add("model-timeline-search", function(Y) {
    "use strict";
    
    var models  = Y.namespace("Falco.Models"),
        
        Search;
        
    Search = Y.Base.create("list", models.TimelineBase, [], {
        initializer : function(config) {
            config || (config = {});
            
            this.get("tweets").setAttrs({
                selector : "statuses",
                api      : "search/tweets",
                
                config : {
                    q     : this.get("query"),
                    count : 100
                }
            });
            
            this.set("url", "/searches/" + this.get("id"));
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
