/*jshint browser:true, yui:true */
YUI.add("app-tristis", function(Y) {
    "use strict";
    
    var gui      = require("nw.gui"),
        conf     = require("config").Twitter,
        Twitter  = require("twit"),
        
        extensions    = Y.namespace("Extensions"),
        tristis       = Y.namespace("Tristis"),
        appExtensions = Y.namespace("Tristis.Extensions"),
        views         = Y.namespace("Tristis.Views"),
        models        = Y.namespace("Tristis.Models"),
        streams       = Y.namespace("Tristis.Streams"),
        
        win = gui.Window.get(),
        
        App;
    
    App = Y.Base.create("tristis", Y.App, [
        extensions.ViewClasses,
        extensions.ViewParent,
        
        appExtensions.Routes,
        appExtensions.Events
    ], {
        initializer : function() {
            if(!localStorage.access_token || !localStorage.access_secret) {
                return this._auth();
            }
            
            this._setup();
        },
        
        destructor : function() {
            models.user.destroy();
            models.timelines.destroy();
        },
        
        _setup : function() {
            var self = this;
            
            tristis.twitter = new Twitter({
                consumer_key        : conf.consumerKey,
                consumer_secret     : conf.consumerSecret,
                access_token        : localStorage.access_token,
                access_token_secret : localStorage.access_secret
            });
            
            models.user      = new models.User();
            models.timelines = new models.Timelines();
            
            // add child view now because they depend on model references existing
            this.set("children", {
                nav : new views.Nav()
            });
            
            // go load user details
            models.user.load(function userLoad(err) {
                if(err) {
                    console.log("userLoad Error", err);
                    
                    // TODO: Getting ECONNRESET here on the first attempt, not sure what the deal is...
                    //return self._auth();
                }
                
                models.timelines.load();
                
                streams.user.start();
                
                self.navigate("/home");
                
                self._render();
            });
        },
        
        _render : function() {
            // Restore size & position
            if(localStorage.width && localStorage.height) {
                win.resizeTo(
                    parseInt(localStorage.width, 10),
                    parseInt(localStorage.height, 10)
                );
                
                win.moveTo(
                    parseInt(localStorage.x, 10),
                    parseInt(localStorage.y, 10)
                );
            }
            
            this.render();
            win.show();
        },
        
        _auth : function() {
            this.navigate("/auth");
            
            this._render();
        }
    }, {
        ATTRS : {
            serverRouting: {
                value : false
            },
            
            children : null
        }
    });
    
    if(!conf.consumerKey || !conf.consumerSecret) {
        console.error("You need to specify an API key!");
        
        return;
    }
    
    tristis.txt = require("twitter-text");
    
    tristis.app = new App({
        viewContainer : ".views"
    });
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "app",
        
        // Generic Extensions
        "extension-view-classes",
        "extension-view-parent",
        
        // Tristis Extensions
        "extension-tristis-events",
        "extension-tristis-routes",
        
        // Models
        "model-user",
        "model-list-timelines",
        
        // Views
        "view-nav",
        
        // CSS
        "css-app",
        "css-nav",
        
        // Streams
        "stream-user",
        "stream-users"
    ]
});
