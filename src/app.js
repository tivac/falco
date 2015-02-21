"use strict";

require("autostrip-json-comments");

var state = require("./state"),
    m     = require("mithril"),
    gui   = require("nw.gui"),
    argv  = require("minimist")(gui.App.argv);

if(argv.debug) {
    gui.Window.get().showDevTools();
}

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
