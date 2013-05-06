YUI.add("app-tristis", function(Y) {
    "use strict";
    
    var gui      = require("nw.gui"),
        conf     = require("config").Twitter,
        Twitter  = require("ntwitter"),
        
        extensions    = Y.namespace("Extensions"),
        tristis       = Y.namespace("Tristis"),
        appExtensions = Y.namespace("Tristis.Extensions"),
        views         = Y.namespace("Tristis.Views"),
        models        = Y.namespace("Tristis.Models"),
        
        App, app;
    
    App = Y.Base.create("tristis", Y.App, [
        extensions.ViewClasses,
        extensions.ViewParent,
        appExtensions.Routes,
        appExtensions.Events
    ], {
        initializer : function() {
            var twitter;
            
            // set up twitter object
            twitter = new Twitter({
                consumer_key        : conf.consumerKey,
                consumer_secret     : conf.consumerSecret,
                access_token_key    : localStorage.oauth_access_token,
                access_token_secret : localStorage.oauth_access_token_secret
            });
            
            tristis.twitter = twitter;
            
            this._verify();
        },
        
        _verify : function() {
            var app = this;
            
            tristis.twitter.verifyCredentials(function(err, data) {
                if(err) {
                    app.navigate("/auth");
                    
                    app.render();
                    gui.Window.get().show();
                    
                    return;
                }
                
                tristis.user = new models.User(data);
                
                // set up children view here because they depend on model above
                app.set("children", {
                    nav : new views.Nav()
                });
                
                app.navigate("/");
                
                app.render();
                gui.Window.get().show();
            });
        }
    }, {
        ATTRS : {
            serverRouting: {
                value : false
            },
            
            children : null
        }
    });
    
    app = new App({
        viewContainer : ".views"
    });
    
    Y.namespace("Tristis").app = app;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "app",
        
        // Extensions
        "extension-tristis-events",
        "extension-tristis-routes",
        "extension-view-classes",
        "extension-view-parent",
        
        // Models
        "model-user",
        
        // Views
        "view-nav"
    ]
});
