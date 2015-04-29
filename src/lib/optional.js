"use strict";

module.exports = function optional(condition, yes, no) {
    return condition ? yes : no;
};
