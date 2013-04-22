/*jshint node:true, browser:true, jquery:true */

"use strict";

var gui = require("nw.gui"),
    win = gui.Window.get();

// Save size on close.
win.on("close", function() {
    localStorage.x      = win.x;
    localStorage.y      = win.y;
    localStorage.width  = win.width;
    localStorage.height = win.height;
    
    this.close(true);
});

// Restore on startup.
window.onload = function() {
    if(localStorage.width && localStorage.height) {
        win.resizeTo(
            parseInt(localStorage.width, 10),
            parseInt(localStorage.height, 10)
        );
        
        win.moveTo(
            parseInt(localStorage.x, 10),
            parseInt(localStorage.y, 10)
        );
    }
    
    // set up initial UI state
    if(localStorage.oauth_access_token) {
        $(".oauth-process").hide();
        $(".twitter").show();
    } else {
        $(".twitter").hide();
    }
    
    win.show();
};
