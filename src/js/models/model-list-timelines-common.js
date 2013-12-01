YUI.add("model-list-timelines-common", function(Y) {
    "use strict";
    
    var models = Y.namespace("Falco.Models"),
        
        TimelinesCommon;
        
    TimelinesCommon = Y.Base.create("common", models.TimelinesBase, [], {
        _models : [
            new models.Home(),
            new models.Mentions()
        ],
        
        initializer : function() {
            this.reset(this._models);
        },
        
        // Dumb sync implementation
        sync : function(action, options, done) {
            done(null, this._models);
        }
    });
    
    models.TimelinesCommon = TimelinesCommon;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-list-timelines-base",
        "model-timeline-home",
        "model-timeline-mentions"
    ]
});
