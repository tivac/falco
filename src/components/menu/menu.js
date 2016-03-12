"use strict";

var m      = require("mithril"),
    emoji  = require("twemoji"),
    
    state  = require("../../lib/state"),
    
    optional  = require("../../lib/optional");

module.exports = {
    view : function() {
        return m(".menu.no-select",
            state.data.order.map(function(key) {
                var list = state.data.lists[key],
                    abbr = emoji.parse(list.abbr);
                
                return m("a.list", {
                        class   : optional(key === state.data.active, "selected"),
                        href    : "/lists/" + key,
                        config  : m.route,
                        tooltip : list.name,
                        
                        "data-unread" : list.unread
                    },
                    optional(
                        abbr === list.abbr,
                        m("span.label", abbr),
                        m.trust(abbr)
                    )
                );
            })
        );
    }
};
