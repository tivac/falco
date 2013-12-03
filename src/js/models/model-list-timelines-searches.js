YUI.add("model-list-timelines-searches", function(Y) {
    "use strict";
    
    var models     = Y.namespace("Falco.Models"),
        extensions = Y.namespace("Falco.Extensions"),
        
        TimelinesSearches;
        
    TimelinesSearches = Y.Base.create("searches", models.TimelinesBase, [
        extensions.ListUsers,
        extensions.TwitterSyncGet
    ], {
        model : models.Search,
        
        comparator : function(model) {
            return model.get("query");
        },
    }, {
        ATTRS : {
            api : {
                value : "saved_searches/list"
            }
        }
    });
    
    models.TimelinesSearches = TimelinesSearches;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-list-timelines-base",
        "model-timeline-search",
        
        // Extensions
        "extension-list-users",
        "extension-twitter-sync-get"
    ]
});
