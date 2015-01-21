"use strict";

require("autostrip-json-comments");

var config = require("rc")(
        require("../package.json").name.toLowerCase(),
        require("../config.json")
    );

console.log(config);
