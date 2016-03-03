"use strict";

var m      = require("mithril"),
    
    state  = require("../../lib/state"),
    emoji  = require("../../lib/emoji"),
    
    optional  = require("../../lib/optional");

module.exports = {
    view : function() {
        return m(".menu.no-select",
            state.data.order.map(function(key) {
                var list = state.data.lists[key],
                    abbr = emoji.replace(list.abbr);
                
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
                        m("img.label.icon", { src : abbr })
                    )
                );
            })
        );
    }
};
