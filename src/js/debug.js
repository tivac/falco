/*jshint node:true, browser:true, jquery:true */

"use strict";

var gui = require("nw.gui"),
    win = gui.Window.get();

// support opening devtools via command-line switch
gui.App.argv.some(function(arg) {
    if(arg !== "--debug") {
        return false;
    }
    
    win.showDevTools();
    
    return true;
});
