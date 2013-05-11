YUI.add("model-list-list-tweets", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        
        ListTweets;
    
    ListTweets = Y.Base.create("listTweets", Y.LazyModelList, [
        Y.namespace("Extensions").ModelListMore
    ], {
        sync : function(action, options, done) {
            tristis.twitter.get("lists/statuses", {
                list_id     : this.get("list_id"),
                // TODO: configurable
                include_rts : true
            }, done);
        }
    }, {
        ATTRS : {
            list_id : null
        }
    });
    
    models.ListTweets = ListTweets;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "lazy-model-list",
        
        // Extensions
        "extension-model-list-more"
    ]
});
