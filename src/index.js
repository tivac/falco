"use strict";

// Include state to kick off updates
require("./lib/state");

var app = require("app"),
    Window = require("browser-window"),
    
    // Keep a global reference of the window object, if you don"t, the window will
    // be closed automatically when the javascript object is GCed.
    main = null;

// Quit when all windows are closed.
app.on("window-all-closed", function() {
    if(process.platform !== "darwin") {
        app.quit();
    }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on("ready", function() {
    /*eslint no-path-concat: 0 */
    
    // Create the browser window.
    main = new Window({
        width  : 800,
        height : 600
    });
    
    // and load the index.html of the app.
    main.loadUrl("file://" + __dirname + "/index.html");

    main.openDevTools({
        detach : true
    });

    // Emitted when the window is closed.
    main.on("closed", function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        main = null;
    });
});
