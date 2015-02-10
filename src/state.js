"use strict";

var immutable = require("immutable");

function State() {
    this._state = immutable.fromJS({
        lists    : [],
        selected : 0
    });
}

State.prototype = {
    addList : function(list) {
        this._state = this._state.update("lists", function(lists) {
            return lists.push(list);
        });
    },
    
    get : function(key) {
        return this._state.get(key);
    }
};

module.exports = State;
