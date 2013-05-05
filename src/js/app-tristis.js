YUI.add("app-tristis", function(Y) {
    "use strict";
    
    var gui         = require("nw.gui"),
        conf        = require("config").Twitter,
        Twitter     = require("ntwitter"),
        
        tristis     = Y.namespace("Tristis"),
        extensions  = Y.namespace("Tristis.extensions"),
        
        App, app;
    
    App = Y.Base.create("tristis", Y.App, [
        extensions.Routes,
        extensions.Events
    ], {
        initializer : function() {
            var twitter;
            
            twitter = new Twitter({
                consumer_key        : conf.consumerKey,
                consumer_secret     : conf.consumerSecret,
                access_token_key    : localStorage.oauth_access_token,
                access_token_secret : localStorage.oauth_access_token_secret
            });
            
            tristis.twitter = twitter;
            
            gui.Window.get().show();
            
            twitter.verifyCredentials(function(err, data) {
                if(err) {
                    return console.error(err);
                }
                
                Y.one(".twitter").append("<img npm src='" + data.profile_image_url + "' />");
            });
        },
        
        destructor : function() {
            
        },
    }, {
        ATTRS : {
            serverRouting: {
                value : true
            }
        }
    });
    
    app = new App({
        viewContainer : ".views"
    })
    .render()
    .dispatch();
    
    Y.namespace("Tristis").app = app;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "app",
        
        // Extensions
        "extension-tristis-events",
        "extension-tristis-routes"
    ]
});
