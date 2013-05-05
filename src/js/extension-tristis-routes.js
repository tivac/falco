YUI.add("extension-tristis-routes", function(Y) {
    "use strict";
    
    var Routes;
    
    Routes = function() {};
    
    Routes.ATTRS = {
        routes : [
            { path : "/",            callbacks : "_routeRoot" },
            { path : "/auth",        callbacks : "_routeAuth" },
            { path : "/search",      callbacks : "_routeSearch" },
            { path : "/lists",       callbacks : "_routeLists" },
            { path : "/lists/:list", callbacks : "_routeList" }
        ]
    };
    
    Routes.prototype = {
        // Route Handles
        _routeRoot : function() {
            // TODO: Show main UI
        },
        
        _routeAuth : function() {
            // TODO: show auth UI
        },
        
        _routeSearch : function() {
            // TODO: show search tweets
        },
        
        _routeLists : function() {
            // TODO: show lists
        },
        
        _routeList : function() {
            // TODO: show list
        }
    };
    
    Y.namespace("Tristis.extensions").Routes = Routes;
    
}, "@VERSION@", {
    requires : [
        
    ]
});
