"use strict";

require("autostrip-json-comments");

var state = require("./state"),
    m     = require("mithril"),
    
    gui   = require("nw.gui"),
    
    argv  = require("minimist")(gui.App.argv);

// Debug keyboard shortcuts
if(argv.debug) {
    Mousetrap.bind("ctrl+shift+r", function() {
        gui.Window.get().reloadDev(); 
    });
    
    Mousetrap.bind("ctrl+shift+k", function() {
        var win = gui.Window.get();
        
        win.isDevToolsOpen() ? win.closeDevTools() : win.showDevTools();
    });
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
