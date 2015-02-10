"use strict";

var EventEmitter = require("events").EventEmitter,
    util = require("util"),
    
    twitter = require("./twitter"),
    State   = require("./state");

function App() {
    this.state = new State();
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
            state.addList(list);
        });
    });
};

App.prototype.loadTweets = function() {
    var selected = this.state.get("selected"),
        list     = this.state.get("lists").get(selected);
        
    console.log(selected, list);
};

module.exports = App;
