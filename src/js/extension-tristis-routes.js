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
            
            Y.lazyLoad("view-timeline", "model-list-timeline", function(errors, attached) {
                // TODO: handle
                if(errors) {
                    return console.log(errors);
                }
                
                if("model-list-timeline" in attached) {
                    models.timeline = new models.Timeline();
                    
                    // load a page of results, then begin streaming new ones
                    models.timeline.load(function(err) {
                        if(err) {
                            return console.log(err);
                        }
                        
                        models.timeline.stream();
                    });
                }
                
                if("view-timeline" in attached) {
                    app.views.timeline = {
                        type     : views.Timeline,
                        preserve : true
                    };
                }
                
                app.showView("timeline");
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
            
            // start attempting to stream updates to all the lists
            models.lists.stream();
            
            Y.lazyLoad("view-list", function(errors) {
                var list;
                
                // TODO: handle
                if(errors) {
                    return console.log(errors);
                }
                
                if(!(req.path in app.views)) {
                    app.views[req.path] = {
                        type     : views.List,
                        preserve : true
                    };
                }
                
                list = models.lists.getById(req.params.list);
                
                list.more(function(err) {
                    if(err) {
                        console.error(err);
                    }
                });
                
                app.showView(req.path, {
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
