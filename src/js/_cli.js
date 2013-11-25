/*jshint node:true, browser:true */
"use strict";

var gui = require("nw.gui"),
    win = gui.Window.get(),
    tools, _save, _restore;

_save = function(key, src) {
    console.log(src.x, src.y, src.width, src.height);
    
    localStorage[key + "_x"]       = src.x;
    localStorage[key + "_y"]       = src.y;
    localStorage[key + "_width"]   = src.width;
    localStorage[key + "_height"]  = src.height;
};

_restore = function(key, tgt) {
    if(!localStorage[key + "_width"]  ||
       !localStorage[key + "_height"] ||
       !localStorage[key + "_x"]      ||
       !localStorage[key + "_y"]) {
        return;
    }
    
    tgt.resizeTo(
        parseInt(localStorage[key + "_width"], 10),
        parseInt(localStorage[key + "_height"], 10)
    );

    tgt.moveTo(
        parseInt(localStorage[key + "_x"], 10),
        parseInt(localStorage[key + "_y"], 10)
    );
};

// Save size/location of main window on close
win.on("close", function() {
    console.log("saving main window positions");
    
    _save("main", win);
});

// Update main window
_restore("main", win);

// support opening devtools via command-line switch
if(gui.App.argv.indexOf("--debug") === -1) {
    return;
}

tools = win.showDevTools();

// Save size/location of main window on close
win.on("close", function() {
    console.log("saving devtools positions");
    
    _save("devtools", tools);
});

_restore("devtools", tools);
