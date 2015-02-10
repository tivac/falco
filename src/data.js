"use strict";

var EventEmitter = require("events").EventEmitter,
    util = require("util"),
    
    immutable = require("immutable"),
    
    twitter = require("./twitter");

function Data() {
    this._state = immutable.fromJS({
        lists : [
            { id_str : "timeline", name : "Timeline", uri : "/home" },
            { id_str : "notifications", name : "Notifications", uri : "/notifications" }
        ],
        selected : "timeline"
    });
    
    console.log(this._state.toJSON());
    
    this.getLists();
}

util.inherits(Data, EventEmitter);

Data.prototype._changed = function() {
    this.emit("change", this._state);
};

Data.prototype.get = function(key) {
    return this._state.get(key);
};

Data.prototype.getLists = function() {
    var self = this;
    
    twitter.get("lists/list", function(error, lists) {
        if(error) {
            return console.error(error);
        }
        
        lists.forEach(function(list) {
            self.addList(list);
        });
    });
};

Data.prototype.addList = function(list) {
    this._state = this._state.update("lists", function(lists) {
        return lists.push(immutable.fromJS(list));
    });
    
    this._changed();
};

Data.prototype.selectList = function(list) {
    this._state = this._state.set("selected", list);
    
    this._changed();
};

Data.prototype.loadTweets = function() {
    var selected = this.state.get("selected"),
        list     = this.state.get("lists").get(selected);
        
    console.log(selected, list);
};

module.exports = Data;
