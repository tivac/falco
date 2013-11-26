/*jshint node:true, browser:true */
"use strict";

var gui = require("nw.gui"),
    win = gui.Window.get(),
    tools, _save, _restore;

_save = function(key, src) {
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

// Update main window
_restore("main", win);

// support opening devtools via command-line switch
if(gui.App.argv.indexOf("--debug") > -1) {
    tools = win.showDevTools();

    _restore("devtools", tools);
}

win.on("close", function() {
    _save("main", win);
    
    if(tools) {
        _save("devtools", tools);
    }
    
    // Make sure other listeners can fire
    process.nextTick(function forceClose() {
        win.close(true);
    });
});
