YUI.add("model-timeline-mentions", function(Y) {
    "use strict";
    
    var models = Y.namespace("Tristis.Models"),
        Mentions;
        
    Mentions = Y.Base.create("mentions", models.TimelineBase, [], {}, {
        ATTRS : {
            id : {
                value : "mentions"
            },
            
            name : {
                value : "Mentions"
            }
        }
    });
    
    models.Mentions = Mentions;
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-timeline-base"
    ]
});
