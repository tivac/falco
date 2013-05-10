YUI.add("model-list-lists", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
    
        Lists;
        
    Lists = Y.Base.create("lists", Y.LazyModelList, [], {
        sync : function(action, options, done) {
            tristis.twitter.get("lists/list", done);
        }
    });
    
    Y.namespace("Tristis.Models").Lists = Lists;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "lazy-model-list"
    ]
});
