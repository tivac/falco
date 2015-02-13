"use strict";

require("autostrip-json-comments");

var m    = require("mithril"),
    data = require("./data");

data.on("change", function(state) {
    console.log("change", state);
    
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
