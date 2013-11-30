/*jshint node:true, browser:true, yui:true */
YUI.add("model-timeline-search", function(Y) {
    "use strict";
    
    var models  = Y.namespace("Falco.Models"),
        
        Search;
        
    Search = Y.Base.create("list", models.TimelineBase, [], {
        initializer : function(config) {
            config || (config = {});
            
            // Keep ID updated to match encoded query param
            this._handles = [
                this.on("queryChange", this._queryChange, this)
            ];
            
            // Force-update ID to match encoded query param
            this._queryChange({ newVal : config.query || this.get("query") });
            
            this.get("tweets").setAttrs({
                api    : "search/tweets",
                config : {
                    q     : this.get("id"),
                    count : 100
                }
            });
            
            this.set("url", "/searches/" + this.get("id"));
        },
        
        _queryChange : function(e) {
            this.set("id", encodeURIComponent(e.newVal));
        }
    }, {
        ATTRS : {
            type : {
                value : "search"
            },
            
            query : {
                value : ""
            }
        }
    });
    
    models.Search = Search;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        
        // Models
        "model-timeline-base"
    ]
});
