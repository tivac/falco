/*jshint node:true */

"use strict";

var shell = require("shelljs");

module.exports = function(config) {
    shell.cp("-R", [
        "./src",
        "./config",
        "./package.json"
    ], "./temp");
};
