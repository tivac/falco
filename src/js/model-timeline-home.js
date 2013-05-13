YUI.add("model-timeline-home", function(Y) {
    "use strict";
    
    var models = Y.namespace("Tristis.Models"),
        Home;
        
    Home = Y.Base.create("home", models.TimelineBase, [], {}, {
        ATTRS : {
            id : {
                value : "home"
            }
        }
    });
    
    models.Home = Home;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-timeline-base"
    ]
});