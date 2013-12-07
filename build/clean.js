/*jshint node:true */
"use strict";

var shell    = require("shelljs");

module.exports = function(config) {
    shell.rm("-rf", "./temp");
    shell.rm("-rf", "./dist");
};
