"use strict";

var gui = require("nw.gui"),
    win, dev;

// support opening devtools via command-line switch
if(gui.App.argv.indexOf("--debug") === -1) {
    return;
}

win = gui.Window.get();
dev = win.showDevTools();

// Restore size
if(localStorage.devtools_width && localStorage.devtools_height) {
    dev.resizeTo(
        parseInt(localStorage.devtools_width, 10),
        parseInt(localStorage.devtools_height, 10)
    );
}

// Restore position
if(localStorage.devtools_x && localStorage.devtools_y) {
    dev.moveTo(
        parseInt(localStorage.devtools_x, 10),
        parseInt(localStorage.devtools_y, 10)
    );
}

// Save devtools size/location on close
win.on("close", function() {
    localStorage.devtools_x       = dev.x;
    localStorage.devtools_y       = dev.y;
    localStorage.devtools_width   = dev.width;
    localStorage.devtools_height  = dev.height;
});
