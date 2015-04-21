"use strict";

var m     = require("mithril"),
    state = require("../lib/state");

module.exports = {
    view : function() {
        var active = state.get("active");
        
        return [
            m(".pure-menu.no-select",
                m("ul.pure-menu-list",
                    state.get("order").map(function(key) {
                        var list = state.get("lists")[key];
                        
                        return m("li.pure-menu-item",
                            m("a.pure-menu-link", {
                                    class   : key === active ? "pure-menu-selected" : null,
                                    href    : "/lists/" + key,
                                    config  : m.route,
                                    tooltip : list.name,
                                    
                                    "data-unread" : list.unread
                                },
                                list.abbr
                            )
                        );
                    })
                )
            )
        ];
    }
};
