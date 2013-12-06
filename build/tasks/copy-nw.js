/*jshint node:true */
"use strict";

var path  = require("path"),
    shell = require("shelljs");

module.exports = function(config) {
    var temp = "./temp/nw";
       
    shell.mkdir("-p", temp);
    shell.cp("-r", path.join(config.nw.dir, "*"), temp);
};
