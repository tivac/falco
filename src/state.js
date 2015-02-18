"use strict";

var EventEmitter = require("events").EventEmitter,
    util = require("util"),
    
    immutable = require("seamless-immutable"),
    debounce  = require("debounce"),
    
    twitter = require("./twitter");

function State() {
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

util.inherits(State, EventEmitter);

// Util
State.prototype._changed = function() {
    this.emit("change", this._state);
};

State.prototype.get = function(key) {
    return this._state[key];
};

// Loading
State.prototype.loadLists = function() {
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

State.prototype.loadTweets = function(list) {
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

State.prototype.loadUsers = function(list) {
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
                list
            );
        }
    );
};

// Streams
State.prototype.streamUsers = debounce(function() {
    var self  = this,
        users = Object.keys(this._state.users).join(",");
    
    // No changes, don't do anything
    if(users === this._users) {
        return;
    }
    
    this._users = users;
    
    twitter.stream("statuses/filter", { follow : users }, function(stream) {
        console.log("Streaming: ", users);
        
        stream.on("data", function(tweet) {
            console.log("Streaming Tweet:", tweet);
            
            var list = self._state.users[tweet.retweeted_status.user.id_str] || self._state.users[tweet.user.id_str];
            
            if(!list) {
                debugger;
            }
            
            self.addTweets(list, [ tweet ]);
        });
        
        stream.on("error", function(err) {
            console.log(err);
        });
    });
}, 500);

// Mutations
State.prototype.addList = function(list) {
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

State.prototype.addUsers = function(users, list) {
    var map = {};
    
    users.forEach(function(id) {
        map[id] = list;
    });
    
    this._state = this._state.merge({
        users : this._state.users.merge(map)
    });
    
    this.streamUsers();
    
    this._changed();
};

State.prototype.addTweets = function(key, tweets) {
    var list  = this._state.lists[key].asMutable(),
        lists = {};
    
    list.tweets = tweets.concat(list.tweets);
    
    lists[key] = list;
    
    this._state = this._state.merge({
        lists : this._state.lists.merge(lists)
    });
    
    this._changed();
};

State.prototype.selectList = function(list) {
    this._state = this._state.merge({
        active : list
    });
    
    this._changed();
};

module.exports = new State();
