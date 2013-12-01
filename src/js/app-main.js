/*jshint browser:true, yui:true */
YUI.add("app-main", function(Y) {
    "use strict";
    
    var gui      = require("nw.gui"),
        conf     = require("config").Twitter,
        Twitter  = require("twit"),
        
        extensions    = Y.namespace("Extensions"),
        falco         = Y.namespace("Falco"),
        appExtensions = Y.namespace("Falco.Extensions"),
        views         = Y.namespace("Falco.Views"),
        models        = Y.namespace("Falco.Models"),
        streams       = Y.namespace("Falco.Streams"),
        
        win = gui.Window.get();
        
    falco.App = Y.Base.create("app", Y.App, [
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
            
            Y.Object.each(models.timelines, function(timelines) {
                timelines.destroy();
            });
        },
        
        _setup : function() {
            falco.twitter = new Twitter({
                consumer_key        : conf.consumerKey,
                consumer_secret     : conf.consumerSecret,
                access_token        : localStorage.access_token,
                access_token_secret : localStorage.access_secret
            });
            
            models.user      = new models.User();
            models.timelines = {
                common   : new models.TimelinesCommon(),
                lists    : new models.TimelinesLists(),
                searches : new models.TimelinesSearches()
            };
            
            // add child view now because they depend on model references existing
            this.set("children", {
                nav : new views.Nav()
            });
            
            // go load user details
            models.user.load(function userLoad(err) {
                if(err) {
                    console.log("userLoad Error", err);
                    
                    // TODO: Getting ECONNRESET here on the first attempt, not sure what the deal is...
                    //return this._auth();
                }
                
                Y.Object.each(models.timelines, function(model) {
                    model.load();
                });
                
                streams.user.start();
                
                this.navigate("/lists/home");
                
                this._render();
            }.bind(this));
        },
        
        _render : function() {
            this.render();
            win.show();
            win.focus();
        },
        
        _auth : function() {
            this.navigate("/oauth");
            
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
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "app",
        
        // Generic Extensions
        "extension-view-classes",
        "extension-view-parent",
        
        // App Extensions
        "extension-app-events",
        "extension-app-routes",
        
        // Models
        "model-user",
        "model-list-timelines-common",
        "model-list-timelines-lists",
        "model-list-timelines-searches",
        
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
