/*jshint node:true */
"use strict";

var shell = require("shelljs");
    
module.exports = function() {
    shell.mkdir("./dist");
};
