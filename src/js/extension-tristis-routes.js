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
                if("model-list-timeline" in attached) {
                    models.timeline = new models.Timeline();
                }
                
                if("view-timeline" in attached) {
                    app.views.timeline = {
                        type     : views.Timeline,
                        preserve : true
                    };
                }
                
                // start streaming after view's been shown
                app.showView("timeline", {}, models.timeline.start);
            });
        },
        
        _routeAuth : function() {
            var app = this;
            
            Y.lazyLoad("view-link", "model-oauth", function(errors, attached) {
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
            console.log(req.path, req);
        }
    };
    
    Y.namespace("Tristis.Extensions").Routes = Routes;
    
}, "@VERSION@", {
    requires : [
        "gallery-lazy-load"
    ]
});
