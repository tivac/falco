"use strict";

require("autostrip-json-comments");

var m    = require("mithril"),
    state = require("./state");

state.on("change", function(current) {
    console.log("change", current);
    
    m.redraw();
});

//m.route.mode = "pathname";

m.route(
    document.querySelector("#layout"),
    "/lists/timeline",
    {
        "/lists/:list" : require("./routes-list")
    }
);
