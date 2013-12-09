YUI.add("extension-app-routes", function(Y) {
    "use strict";
    
    var views  = Y.namespace("Falco.Views"),
        models = Y.namespace("Falco.Models"),
        Routes;
    
    Routes = function() {};
    Routes.ATTRS = {
        routes : {
            value : [
                { path : "/oauth",            callbacks : "_routeOAuth" },
                { path : "/options",          callbacks : "_routeOptions" },
                { path : "/lists/:list",      callbacks : "_routeList" },
                { path : "/searches/:search", callbacks : "_routeSearch" },
            ]
        }
    };
    
    Routes.prototype = {
        _showTimeline : function(name) {
            Y.lazyLoad("view-timeline", function(errors) {
                var list, tweets;
                
                // TODO: handle?
                if(errors) {
                    return console.log(errors);
                }
                
                if(!this.views[name]) {
                    this.views[name] = {
                        type     : views.Timeline,
                        preserve : true
                    };
                }
                
                Y.Object.some(models.timelines, function(timelines) {
                    list = timelines.getById(name);
                    
                    return list;
                });
                
                tweets = list.get("tweets");
                
                // Load first page of tweets via REST api if needed
                if(list.get("tweets").size() < 100) {
                    debugger;
                    tweets.backfill(); // TODO: see model-list-tweets.js for explanation
                }
                
                this.showView(name, {
                    model : list
                });
            }.bind(this));
        },
        
        // Route Handles
        _routeOAuth : function() {
            Y.lazyLoad("view-oauth", function(errors, attached) {
                // TODO: handle
                if(errors) {
                    return console.log(errors);
                }
                
                if("model-oauth" in attached) {
                    models.oauth = new models.OAuth();
                }
                
                if("view-oauth" in attached) {
                    this.views.oauth = {
                        type     : views.OAuth,
                        preserve : false
                    };
                }
                
                this.showView("oauth");
            }.bind(this));
        },
        
        _routeOptions : function() {
            Y.lazyLoad("view-options", function(errors, attached) {
                // TODO: handle
                if(errors) {
                    return console.log(errors);
                }
                
                if("view-options" in attached) {
                    this.views.options = {
                        type     : views.Options,
                        preserve : false
                    };
                }
                
                this.showView("options");
            }.bind(this));
        },
        
        _routeList : function(req) {
            this._showTimeline(req.params.list);
        },
        
        _routeSearch : function(req) {
            this._showTimeline(req.params.search);
        }
    };
    
    Y.namespace("Falco.Extensions").Routes = Routes;
    
}, "@VERSION@", {
    requires : [
        // Gallery
        "gallery-lazy-load"
    ]
});
