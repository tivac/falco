"use strict";

var state = require("./lib/state"),
    m     = require("mithril"),
    
    gui   = require("nw.gui");

window.state = state;

gui.Window.get().showDevTools();

state.on("change", function() {
    m.redraw();
});

m.route(
    document.querySelector("#layout"),
    "/lists/timeline",
    {
        "/lists/:list" : require("./components/list")
    }
);
