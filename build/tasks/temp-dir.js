/*jshint node:true */
"use strict";

var path = require("path");

module.exports = function(config) {
    config.temp = path.join("./temp", "falco-v" + config.package.version);
};
