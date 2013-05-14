YUI.add("extension-tristis-routes", function(Y) {
    "use strict";
    
    var views  = Y.namespace("Tristis.Views"),
        models = Y.namespace("Tristis.Models"),
        Routes;
    
    Routes = function() {};
    Routes.ATTRS = {
        routes : {
            value : [
                { path : "/",            callbacks : "_routeRoot" },
                { path : "/auth",        callbacks : "_routeAuth" },
                { path : "/search",      callbacks : "_routeSearch" },
                { path : "/lists",       callbacks : "_routeLists" },
                { path : "/lists/:list", callbacks : "_routeList" }
            ]
        }
    };
    
    Routes.prototype = {
        // Route Handles
        _routeRoot : function() {
            var app = this;
            
            Y.lazyLoad("view-timeline", function(errors, attached) {
                var home;
                
                // TODO: handle
                if(errors) {
                    return console.log(errors);
                }
                
                if("view-timeline" in attached) {
                    app.views.home = {
                        type     : views.Timeline,
                        preserve : true
                    };
                }
                
                home = models.timelines.getById("home");
                
                // Load first page of tweets via REST api
                home.get("tweets").load();
                
                app.showView("home", {
                    model : home
                });
            });
        },
        
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
        
        _routeSearch : function(req) {
            // TODO: show search tweets
            
            console.log(req.path, req);
        },
        
        _routeLists : function(req) {
            // TODO: show lists
            
            console.log(req.path, req);
        },
        
        _routeList : function(req) {
            var app = this;
            
            Y.lazyLoad("view-timeline", function(errors) {
                var list, tweets;
                
                // TODO: handle
                if(errors) {
                    return console.log(errors);
                }
                
                if(!(req.path in app.views)) {
                    app.views[req.params.list] = {
                        type     : views.Timeline,
                        preserve : true
                    };
                }
                
                list   = models.timelines.getById(req.params.list);
                tweets = list.get("tweets");
                
                tweets[tweets.size() ? "more" : "load"]();
                
                app.showView(req.params.list, {
                    model : list
                });
            });
        }
    };
    
    Y.namespace("Tristis.Extensions").Routes = Routes;
    
}, "@VERSION@", {
    requires : [
        // Gallery
        "gallery-lazy-load"
    ]
});
