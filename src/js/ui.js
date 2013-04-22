/*jshint node:true, browser:true, jquery:true */

"use strict";

var gui     = require("nw.gui"),
    win     = gui.Window.get(),
    Chirrup = global.Chirrup;

Chirrup.showOauth = function() {
    $(".twitter").hide();
    $(".oauth-process").show();
    
    $.getScript("js/oauth.js");
};

Chirrup.showTwitter = function() {
    $(".oauth-process").hide();
    $(".twitter").show();
    
    $.getScript("js/twitter.js");
};

// Save size on close.
win.on("close", function() {
    localStorage.x      = win.x;
    localStorage.y      = win.y;
    localStorage.width  = win.width;
    localStorage.height = win.height;
    
    process.nextTick(function() {
        win.close(true);
    });
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
        Chirrup.showTwitter();
    } else {
        Chirrup.showOauth();
    }
    
    win.show();
};


