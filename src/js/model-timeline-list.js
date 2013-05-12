YUI.add("model-timeline-list", function(Y) {
    "use strict";
    
    var models  = Y.namespace("Tristis.Models"),
        
        List;
        
    List = Y.Base.create("list", models.TimelineBase, [], {});
    
    models.List = List;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-timeline-base"
    ]
});
