YUI.add("model-user", function(Y) {
    "use strict";
    
    var falco = Y.namespace("Falco"),
        User;
    
    User = Y.Base.create("user", Y.Model, [], {
        sync : function(action, options, done) {
            falco.twitter.get("account/verify_credentials", function(err, details) {
                if(err) {
                    return done(err);
                }
                
                details.profile_banner_url = details.profile_banner_url + "/mobile";
                
                done(null, details);
            });
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
            profile_banner_url      : null
        }
    });
    
    Y.namespace("Falco.Models").User = User;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model"
    ]
});
