"use strict";

var m     = require("mithril"),
    state = require("./state");

module.exports = function() {
    var active = state.get("active");
    
    return [
        m("a.menu-link[href='#menu'][id='menuLink']",
            m("span")
        ),
        m("[id='menu']",
            m(".pure-menu",
                m("a.pure-menu-heading[href='#']", "Falco"),
                m("ul.pure-menu-list",
                    state.get("order").map(function(key) {
                        var list = state.get("lists")[key];
                        
                        return m("li.pure-menu-item",
                            m("a.pure-menu-link", {
                                    class   : key === active ? "pure-menu-selected" : null,
                                    href    : "/lists/" + key,
                                    config  : m.route
                                },
                                list.name + " (" + list.tweets.length + ")"
                            )
                        );
                    })
                )
            )
        )
    ];
};
