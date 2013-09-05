"use strict";

var gui = require("nw.gui");

// support opening devtools via command-line switch
if(gui.App.argv.indexOf("--debug") > -1) {
    gui.Window.get().showDevTools();
}
