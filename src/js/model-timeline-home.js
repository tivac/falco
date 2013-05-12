YUI.add("model-timeline-home", function(Y) {
    "use strict";
    
    var models = Y.namespace("Tristis.Models"),
        Home;
        
    Home = Y.Base.create("home", models.TimelineBase, [], {});
    
    models.Home = Home;
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-timeline-base"
    ]
});
