/*jshint node:true */
"use strict";

var shell = require("shelljs");
    
module.exports = function(config) {
    shell.mkdir("-p", config.temp);
};
