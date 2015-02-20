"use strict";

require("autostrip-json-comments");

var m    = require("mithril"),
    state = require("./state");

state.on("change", function(current) {
    console.log("change", current.asMutable({ deep : true }));
    
    m.redraw();
});

m.route(
    document.querySelector("#layout"),
    "/lists/timeline",
    {
        "/lists/:list" : require("./routes-list")
    }
);
