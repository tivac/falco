"use strict";

var EventEmitter = require("events").EventEmitter,
    util = require("util"),
    
    immutable = require("seamless-immutable"),
    
    twitter = require("./twitter");

function Data() {
    this._state = immutable({
        active : "timeline",
        users  : {},
        order  : [ "timeline", "notifications" ],
        lists  : {
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
    this.loadTweets(this._state.active);
}

util.inherits(Data, EventEmitter);

// Util
Data.prototype._changed = function() {
    this.emit("change", this._state);
};

Data.prototype.get = function(key) {
    return this._state[key];
};

// Loading
Data.prototype.loadLists = function() {
    var self = this;
    
    twitter.get("lists/list", function(err, lists) {
        if(err) {
            return console.log(err);
        }
        
        lists.forEach(function(list) {
            self.addList(list);
        });
    });
};

Data.prototype.loadTweets = function(list) {
    var self = this,
        options = {
            count       : 200,
            include_rts : true
        },
        url;
        
    if(list === "timeline") {
        url = "statuses/home_timeline";
    } else if(list === "notifications") {
        url = "statuses/mentions_timeline";
    } else {
        url = "lists/statuses";
        options.list_id = list;
    }
    
    twitter.get(url, options, function(err, tweets) {
        if(err) {
            return console.log(err);
        }
        
        self.addTweets(list, tweets);
    });
};

Data.prototype.loadUsers = function(list) {
    var self = this;
    
    // No-ops in the special lists case, this is handled by the user stream
    if(list === "timeline" || list === "notifications") {
        return;
    }
    
    twitter.get(
        "lists/members", {
            list_id     : list,
            count       : 5000,
            skip_status : true
        },
        function(err, resp) {
            if(err) {
                return console.log(err);
            }
            
            self.addUsers(
                resp.users.map(function(user) {
                    return user.id_str;
                }),
                list.id_str
            );
        }
    );
};

// Mutations
Data.prototype.addList = function(list) {
    var id    = list.id_str,
        lists = {};
    
    lists[id] = {
        name   : list.name,
        uri    : list.uri,
        tweets : []
    };
    
    this._state = this._state.merge({
        lists : this._state.lists.merge(lists),
        order : this._state.order.concat([ id ])
    });
    
    // Go get users for this list to track
    this.loadUsers(id);
    
    this._changed();
};

Data.prototype.addUsers = function(users, list) {
    var map = {};
    
    users.forEach(function(id) {
        map[id] = list;
    });
    
    this._state = this._state.merge({
        users : this._state.users.merge(map)
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
        active : list
    });
    
    this._changed();
};

module.exports = new Data();
