"use strict";

var m      = require("mithril"),
    
    state  = require("../../lib/state"),
    emoji  = require("../../lib/emoji"),
    
    optional  = require("../../lib/optional");

module.exports = {
    view : function() {
        var active = state.get("active"),
            lists  = state.get("lists");
        
        return m(".menu.no-select",
            state.get("order").asMutable().map(function(key) {
                var list   = lists[key],
                    abbr   = emoji.replace(list.abbr);
                
                return m("a.list", {
                        class   : optional(key === active, "selected"),
                        href    : "/lists/" + key,
                        config  : m.route,
                        tooltip : list.name,
                        "data-unread" : list.unread
                    },
                    optional(
                        abbr === list.abbr,
                        abbr,
                        m("img.emoji", {
                            src : abbr
                        })
                    )
                );
            })
        );
    }
};
