/*global Mousetrap:true */
"use strict";

require("autostrip-json-comments");

var state = require("./state"),
    m     = require("mithril"),
    
    gui   = require("nw.gui"),
    argv  = require("minimist")(gui.App.argv);

// Debug helpers
if(argv.debug) {
    window.state = state;

    Mousetrap.bind("ctrl+shift+r", function() {
        gui.Window.get().reloadDev();
    });
    
    Mousetrap.bind("ctrl+shift+k", function() {
        var win = gui.Window.get();
        
        win[win.isDevToolsOpen() ? "closeDevTools" : "showDevTools"]();
    });
    
    gui.Window.get().showDevTools();
}

state.on("change", function(current) {
    console.log("State Change", current.asMutable({ deep : true }));
    
    m.redraw();
});

m.route(
    document.querySelector("#layout"),
    "/lists/timeline",
    {
        "/lists/:list" : require("./routes-list")
    }
);
