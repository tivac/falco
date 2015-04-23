"use strict";

var m = require("mithril"),
    
    state = require("./lib/state"),
    pages = {
        list : require("./pages/list"),
        user : require("./pages/user")
    };

state.on("change", function() {
    m.redraw();
});

m.route(
    document.body,
    "/lists/timeline",
    {
        "/lists/:list" : pages.list,
        "/user/:user"  : pages.user
    }
);
