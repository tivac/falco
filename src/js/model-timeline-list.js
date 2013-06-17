YUI.add("model-timeline-list", function(Y) {
    "use strict";
    
    var models  = Y.namespace("Tristis.Models"),
        streams = Y.namespace("Tristis.Streams"),
        
        List;
        
    List = Y.Base.create("list", models.TimelineBase, [], {
        initializer : function() {
            this.get("tweets").setAttrs({
                api    : "lists/statuses",
                config : {
                    list_id     : this.get("id_str"),
                    include_rts : true
                }
            });
            
            this.set("url", "/lists/" + this.get("id"));
        }
    }, {
        ATTRS : {
            type : {
                value : "list"
            }
        }
    });
    
    models.List = List;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-timeline-base"
    ]
});
