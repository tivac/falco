YUI.add("model-list-friends", function(Y) {
    "use strict";
    
    var models = Y.namespace("Tristis.Models"),
        Friends;
    
    Friends = Y.Base.create("friends", Y.LazyModelList, []);
    
    models.Friends = Friends;
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "lazy-model-list"
    ]
});
