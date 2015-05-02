"use strict";

var m         = require("mithril"),
    delegated = require("delegated"),
    
    // Electron
    shell  = require("shell"),
    
    remote = require("remote"),
    Menu   = remote.require("menu"),
    
    // Libs
    state   = require("../../lib/state"),
    
    // Components
    tweet = require("../tweet/tweet"),
    
    context;

context = Menu.buildFromTemplate([{
    label : "Open in browser",
    click : function() {
        console.log(arguments);
    }
}]);

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
                }),
                oncontextmenu : delegated(".tweet", function(e, el) {
                    e.preventDefault();
                    
                    context.popup(remote.getCurrentWindow());
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
