"use strict";

var m         = require("mithril"),
    delegated = require("delegated"),
    
    // Electron
    shell  = require("shell"),
    
    // Libs
    state   = require("../../lib/state"),
    
    // Components
    tweet = require("../tweet/tweet");


module.exports = {
    view : function() {
        var active = state.get("active"),
            list   = state.get("lists")[active];
        
        if(!list) {
            return m(".error", "Unknown list: " + active);
        }
        
        return m(".current-list", {
                onclick : delegated("a", function(e, a) {
                    e.preventDefault();
                    
                    if(a.matches(".username")) {
                        return m.route("/user/" + a.getAttribute("data-screen-name"));
                    }
                    
                    shell.openExternal(a.getAttribute("href"));
                })
            },
            // Call to asMutable here is necessary to prevent weirdness w/ mithril interactions
            list.items.asMutable().map(function tweetMarkup(item) {
                return m.component(tweet, {
                    key   : item.id_str,
                    tweet : item
                });
            })
        );
    }
};
