"use strict";

// Register locales
require("./lib/moment-locales");

var m = require("mithril"),
    
    state = require("./lib/state");

state.on("change", m.redraw);

m.route(
    document.body,
    "/lists/timeline",
    {
        "/lists/:list" : require("./pages/list"),
        "/user/:user"  : require("./pages/user")
    }
);
