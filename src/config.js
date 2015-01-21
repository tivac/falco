"use strict";

module.exports = require("rc")(
    require("../package.json").name,
    require("../config.json")
);
