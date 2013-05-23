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
                { path : "/mentions",    callbacks : "_routeMentions" },
                { path : "/search",      callbacks : "_routeSearch" },
                { path : "/lists",       callbacks : "_routeLists" },
                { path : "/lists/:list", callbacks : "_routeList" },
            ]
        }
    };
    
    Routes.prototype = {
        // Route Handles
        _routeRoot : function() {
            var app = this;
            
            Y.lazyLoad("view-timeline", function(errors) {
                var home, tweets;
                
                // TODO: handle
                if(errors) {
                    return console.log(errors);
                }
                
                if(!app.views.home) {
                    app.views.home = {
                        type     : views.Timeline,
                        preserve : true
                    };
                }
                
                home   = models.timelines.getById("home");
                tweets = home.get("tweets");
                
                // Load first page of tweets via REST api if needed
                if(!tweets.loaded && !tweets.loading) {
                    tweets.load();
                }
                
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
        
        _routeMentions : function() {
            var app = this;
            
            Y.lazyLoad("view-timeline", function(errors) {
                var mentions, tweets;
                
                // TODO: handle
                if(errors) {
                    return console.log(errors);
                }
                
                if(!app.views.mentions) {
                    app.views.mentions = {
                        type     : views.Timeline,
                        preserve : true
                    };
                }
                
                mentions = models.timelines.getById("mentions");
                tweets   = mentions.get("tweets");
                
                // Load first page of tweets via REST api if needed
                if(!tweets.loaded && !tweets.loading) {
                    tweets.load();
                }
                
                app.showView("mentions", {
                    model : mentions
                });
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
                
                if(!app.views[req.params.list]) {
                    app.views[req.params.list] = {
                        type     : views.Timeline,
                        preserve : true
                    };
                }
                
                list   = models.timelines.getById(req.params.list);
                tweets = list.get("tweets");
                
                tweets[tweets.loaded ? "more" : "load"]();
                
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
