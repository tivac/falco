"use strict";

var gui = require("nw.gui"),
    win = gui.Window.get();

// support opening devtools via command-line switch
if(gui.App.argv.indexOf("--debug") > -1) {
    win.showDevTools();
}
