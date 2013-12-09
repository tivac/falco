/*jshint node:true */

"use strict";

var fs    = require("fs"),
    spawn = require("child_process").spawn;

module.exports = function debugTask(config) {
    if(!fs.existsSync(config.nw.dir)) {
        return config.nw.dir + " does not exist.";
    }

    
    spawn(
        "nw.exe",
        [ "../../", "--debug" ],
        {
            cwd      : config.nw.dir,
            detached : true,
            stdio    : [ "ignore", "ignore", "ignore" ]
        }
    ).unref();
};
