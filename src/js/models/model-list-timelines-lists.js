YUI.add("model-list-timelines-lists", function(Y) {
    "use strict";
    
    var models     = Y.namespace("Falco.Models"),
        extensions = Y.namespace("Falco.Extensions"),
        
        TimelinesLists;
        
    TimelinesLists = Y.Base.create("lists", models.TimelinesBase, [
        extensions.ListUsers,
        extensions.TwitterSyncGet
    ], {
        model : models.List
    }, {
        ATTRS : {
            api : {
                value : "lists/list"
            }
        }
    });
    
    models.TimelinesLists = TimelinesLists;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-list-timelines-base",
        "model-timeline-list",
        
        // Extensions
        "extension-list-users",
        "extension-twitter-sync-get"
    ]
});
