/*jshint node:true */

"use strict";

var spawn = require("child_process").spawn;

module.exports = function debugTask(config) {
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
