"use strict";

var state = require("./lib/state"),
    
    m = require("mithril"),
    
    menu = require("./components/menu/menu"),
    list = require("./components/list/list");

state.on("change", function() {
    m.redraw();
});

m.route(
    document.body,
    "/lists/timeline",
    {
        "/lists/:list" : {
            view : function() {
                return m(".content",
                    m.component(menu),
                    m.component(list)
                );
            }
        }
    }
);
