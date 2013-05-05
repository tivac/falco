YUI.add("extension-tristis-routes", function(Y) {
    "use strict";
    
    var Routes;
    
    Routes = function() {
        console.log(this);
    };
    
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
        _routeRoot : function(req) {
            // TODO: Show main UI
            
            console.log(req.path, req);
        },
        
        _routeAuth : function(req) {
            // TODO: show auth UI
            
            console.log(req.path, req);
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
            // TODO: show list
            
            console.log(req.path, req);
        }
    };
    
    Y.namespace("Tristis.extensions").Routes = Routes;
    
}, "@VERSION@", {
    requires : [
        
    ]
});
