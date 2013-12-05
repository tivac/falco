/*jshint node:true */
"use strict";

var path = require("path");

module.exports = function(config) {
    config.nw.dir = path.join("./bin", config.nw.name[config.platform]);
};
