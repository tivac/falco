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
            if(!localStorage.access_token || !localStorage.access_secret) {
                return this._verifyFailed();
            }
            
            this._twitter();
            this._verify();
        },
        
        // set up twitter object
        _twitter : function() {
            tristis.twitter = new Twitter({
                consumer_key        : conf.consumerKey,
                consumer_secret     : conf.consumerSecret,
                access_token_key    : localStorage.access_token,
                access_token_secret : localStorage.access_secret
            });
        },
        
        _verify : function() {
            var app = this;
            
            tristis.twitter.get("account/verify_credentials", function(err, resp) {
                if(err) {
                    return app._verifyFailed();
                }
                
                tristis.user = new models.User(resp);
                
                // set up children view here because they depend on model above
                app.set("children", {
                    nav : new views.Nav()
                });
                
                app.navigate("/");
                
                app.render();
                gui.Window.get().show();
            });
        },
        
        _verifyFailed : function() {
            this.navigate("/auth");
            this.render();
            
            gui.Window.get().show();
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
