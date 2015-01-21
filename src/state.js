"use strict";

var immutable = require("immutable");

exports.initial = function() {
    return immutable.fromJS({
        lists    : [],
        selected : 0
    });
};

exports.lists = immutable.List();
