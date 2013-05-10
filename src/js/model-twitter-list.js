YUI.add("model-twitter-list", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        
        List;
        
    List = Y.Base.create("list", Y.Model, [], {
        initializer : function() {
            var tweets;
            
            tweets = new models.ListTweets({
                list_id : this.get("id")
            });
            
            this.set("tweets", tweets);
        },
        
        sync : function(action, options, done) {
            tristis.twitter.get("lists/show", { list_id : this.get("id") }, done);
        }
    });
    
    models.List = List;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model",
        
        // Models
        "model-list-list-tweets"
    ]
});
