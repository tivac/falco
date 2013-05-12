YUI.add("model-list-tweets", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        
        Tweets;
    
    Tweets = Y.Base.create("tweets", Y.LazyModelList, [
        Y.namespace("Extensions").ModelListMore
    ], {
        sync : function(action, options, done) {
            var args = {},
                last;
            
            if(action === "more") {
                last = this.item(this.size() - 1);
                
                if(last) {
                    args.since_id = last.id_str;
                }
            }
            
            // TODO: Make list/home agnostic somehow. Config-based?
            tristis.twitter.get("lists/statuses", Y.merge({
                list_id     : this.get("list_id"),
                // TODO: configurable?
                include_rts : true,
                count       : 50
            }, args), done);
        },
        
        comparator : function(model) {
            return Date.parse(model.created_at);
        }
    }, {
        ATTRS : {
            list_id : null
        }
    });
    
    models.Tweets = Tweets;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "lazy-model-list",
        
        // Extensions
        "extension-model-list-more"
    ]
});
