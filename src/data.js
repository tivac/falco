"use strict";

var EventEmitter = require("events").EventEmitter,
    util = require("util"),
    
    immutable = require("immutable"),
    
    twitter = require("./twitter");

function Data() {
    this._state = immutable.fromJS({
        selected : "timeline",
        lists : {
            timeline : {
                name    : "Timeline",
                uri     : "/home",
                tweets  : []
            },
            
            notifications : {
                name    : "Notifications",
                uri     : "/notifications",
                tweets  : []
            }
        }
    });
    
    this.loadLists();
    this.loadTweets();
}

util.inherits(Data, EventEmitter);

Data.prototype._changed = function() {
    this.emit("change", this._state);
};

Data.prototype.get = function(key) {
    return this._state.get(key);
};

Data.prototype.loadLists = function() {
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

Data.prototype.loadTweets = function() {
    var self     = this,
        selected = this._state.get("selected"),
        url;
        
    if(selected === "timeline") {
        url = "statuses/home_timeline";
    }
    
    twitter.get(url, function(error, tweets) {
        if(error) {
            console.log(error);
            
            return;
        }
        
        self.addTweets(selected, tweets);
    });
};

Data.prototype.addList = function(list) {
    this._state = this._state.update("lists", function(lists) {
        return lists.set(
            list.id_str,
            immutable.fromJS({
                name   : list.name,
                uri    : list.uri,
                tweets : []
            })
        );
    });
    
    this._changed();
};

Data.prototype.addTweets = function(list, tweets) {
    this._state = this._state.updateIn([ "lists", list ], function(list) {
        return list.update("tweets", function(current) {
            return current.concat(immutable.fromJS(tweets));
        });
    });
        
    this._changed();
};

Data.prototype.selectList = function(list) {
    this._state = this._state.set("selected", list);
    
    this._changed();
};


module.exports = Data;
