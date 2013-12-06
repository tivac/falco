/*jshint node:true */
"use strict";

module.exports = function(config) {
    config.app = "falco-v" + config.package.version;
};
