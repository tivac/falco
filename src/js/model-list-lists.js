YUI.add("model-list-lists", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        
        Lists;
        
    Lists = Y.Base.create("lists", Y.ModelList, [], {
        model : models.List,
        
        sync : function(action, options, done) {
            tristis.twitter.get("lists/list", done);
        }
    });
    
    models.Lists = Lists;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model-list",
        
        // Models
        "model-twitter-list"
    ]
});
