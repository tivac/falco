YUI.add("model-user", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        User;
    
    User = Y.Base.create("user", Y.Model, [], {
        sync : function(action, options, done) {
            tristis.twitter.get("account/verify_credentials", done);
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
            profile_image_url_https : null
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
