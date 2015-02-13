"use strict";

var EventEmitter = require("events").EventEmitter,
    util = require("util"),
    
    immutable = require("seamless-immutable"),
    
    twitter = require("./twitter");

function Data() {
    this._state = immutable({
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
        },
        order : [ "timeline", "notifications" ]
    });
    
    this.loadLists();
    this.loadTweets();
}

util.inherits(Data, EventEmitter);

Data.prototype._changed = function() {
    this.emit("change", this._state);
};

Data.prototype.get = function(key) {
    return this._state[key];
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
        selected = this._state.selected,
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
    var lists = {};
    
    lists[list.id_str] = {
        name   : list.name,
        uri    : list.uri,
        tweets : []
    };
    
    this._state = this._state.merge({
        lists : this._state.lists.merge(lists),
        order : this._state.order.concat([ list.id_str ])
    });
    
    this._changed();
};

Data.prototype.addTweets = function(key, tweets) {
    var list  = this._state.lists[key].asMutable(),
        lists = {};
    
    list.tweets = tweets.concat(list.tweets);
    
    lists[key] = list;
    
    this._state = this._state.merge({
        lists : this._state.lists.merge(lists)
    });
    
    this._changed();
};

Data.prototype.selectList = function(list) {
    this._state = this._state.merge({
        selected : list
    });
    
    this._changed();
};


module.exports = new Data();
