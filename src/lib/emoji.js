"use strict";

var twemoji = require("twemoji");

exports.parse = function(text) {
    return twemoji.parse(
        text,
        function(icon) {
            return "../../node_modules/twemoji/svg/" + icon + ".svg";
        }
    );
};
