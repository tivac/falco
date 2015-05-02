"use strict";

module.exports = function optional(condition, yes, no) {
    return Boolean(condition) ? yes : no;
};
