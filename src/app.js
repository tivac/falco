"use strict";

var EventEmitter = require("events").EventEmitter,
    util = require("util"),
    
    twitter = require("./twitter"),
    state   = require("./state");

function App() {
    this._state = state.initial();
}

util.inherits(App, EventEmitter);

App.prototype.addList = function(list) {
    this._state = this._state.update("lists", function(lists) {
        return lists.push(list);
    });
    
    this.emit("change", this._state);
};

module.exports = App;
