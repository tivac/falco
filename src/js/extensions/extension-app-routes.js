/*jshint browser:true, yui:true, node:true */
YUI.add("extension-app-routes", function(Y) {
    "use strict";
    
    var views  = Y.namespace("Falco.Views"),
        models = Y.namespace("Falco.Models"),
        Routes;
    
    Routes = function() {};
    Routes.ATTRS = {
        routes : {
            value : [
                { path : "/auth",        callbacks : "_routeAuth" },
                { path : "/home",        callbacks : "_routeHome" },
                { path : "/mentions",    callbacks : "_routeMentions" },
                { path : "/lists/:list", callbacks : "_routeList" },
            ]
        }
    };
    
    Routes.prototype = {
        _loaded : {},
        
        _showTimeline : function(name) {
            var app = this;
            
            Y.lazyLoad("view-timeline", function(errors) {
                var list, tweets;
                
                // TODO: handle?
                if(errors) {
                    return console.log(errors);
                }
                
                if(!app.views[name]) {
                    app.views[name] = {
                        type     : views.Timeline,
                        preserve : true
                    };
                }
                
                list   = models.timelines.getById(name);
                tweets = list.get("tweets");
                
                // Load first page of tweets via REST api if needed
                if(!app._loaded[name]) {
                    tweets.more({ sync : "twitter" });
                    
                    app._loaded[name] = 1;
                }
                
                app.showView(name, {
                    model : list
                });
            });
        },
        
        // Route Handles
        _routeAuth : function() {
            var app = this;
            
            Y.lazyLoad("view-link", "model-oauth", function(errors, attached) {
                // TODO: handle
                if(errors) {
                    return console.log(errors);
                }
                
                if("model-oauth" in attached) {
                    models.oauth = new models.OAuth();
                }
                
                if("view-link" in attached) {
                    app.views.link = {
                        type     : views.Link,
                        preserve : false
                    };
                }
                
                app.showView("link");
            });
        },
        
        _routeHome : function() {
            this._showTimeline("home");
        },
        
        _routeMentions : function() {
            this._showTimeline("mentions");
        },
        
        _routeList : function(req) {
            this._showTimeline(req.params.list);
        }
    };
    
    Y.namespace("Falco.Extensions").Routes = Routes;
    
}, "@VERSION@", {
    requires : [
        // Gallery
        "gallery-lazy-load"
    ]
});
