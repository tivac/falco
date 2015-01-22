"use strict";

var EventEmitter = require("events").EventEmitter,
    util = require("util"),
    
    twitter = require("./twitter"),
    state   = require("./state");

function App() {
    this._state = state.initial();
}

util.inherits(App, EventEmitter);

App.prototype.getLists = function() {
    var self = this;
    
    twitter.get("lists/list", function(error, lists) {
        if(error) {
            console.error(error);
            
            return;
        }
        
        lists.forEach(function(list) {
            self.addList(list);
        });
    });
};

App.prototype.addList = function(list) {
    this._state = this._state.update("lists", function(lists) {
        return lists.push(list);
    });
    
    this.emit("change", this._state);
};

App.prototype.loadTweets = function() {
    var selected = this._state.get("selected"),
        list     = this._state.get("lists").get(selected);
        
    console.log(selected, list);
};

module.exports = App;
