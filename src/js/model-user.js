YUI.add("model-user", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        User;
    
    User = Y.Base.create("user", Y.Model, [], {
        initializer : function() {
            // TODO: User Model should attempt to load user info via sync
            // TODO: User Model should create a "user lists" LML & also start that loading
            
            tristis.twitter.get("lists/list", function(error, response) {
                console.log("list subscriptions");
                console.log(error);
                console.log(response);
            });
        },
        
        sync : function() {
            
        },
        
        parse : function() {
            
        },
        
        lists : function() {
            
        }
    }, {
        ATTRS : {
            // meta
            description : null,
            name        : null,
            screen_name : null,
            verified    : null,
            
            // images
            profile_image_url       : null,
            profile_image_url_https : null,
            
            // lists
        }
    });
    
    Y.namespace("Tristis.Models").User = User;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model"
    ]
});
