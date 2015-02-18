"use strict";

var m    = require("mithril"),
    data = require("./data");

module.exports = function() {
    var active = data.get("active");
    
    return [
        m("a.menu-link[href='#menu'][id='menuLink']",
            m("span")
        ),
        m("[id='menu']",
            m(".pure-menu",
                m("a.pure-menu-heading[href='#']", "Falco"),
                m("ul.pure-menu-list",
                    data.get("order").map(function(key) {
                        var list = data.get("lists")[key];
                        
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
