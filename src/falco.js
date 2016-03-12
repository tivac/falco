"use strict";

var m = require("mithril"),

    state;

// Register locales
require("./lib/moment-locales");

state = window.state = require("./lib/state");

state.on("change", m.redraw);

m.route(
    document.body,
    "/lists/timeline",
    {
        "/lists/:list" : require("./pages/list"),
        "/user/:user"  : require("./pages/user")
    }
);
