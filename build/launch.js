/*jshint node:true */

"use strict";

var spawn = require("child_process").spawn;

module.exports = function launchTask(config) {
    spawn(
        "nw.exe",
        [ "../../" ],
        {
            cwd      : config.nw.dir,
            detached : true,
            stdio    : [ "ignore", "ignore", "ignore" ]
        }
    ).unref();
};
