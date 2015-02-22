"use strict";

var EventEmitter = require("events").EventEmitter,
    util = require("util"),
    
    immutable = require("seamless-immutable"),
    debounce  = require("debounce"),
    
    config  = require("./config"),
    twitter = require("./twitter");
    

function State() {
    this._state = immutable({
        active : "timeline",
        users  : {},
        order  : [ "timeline", "notifications" ],
        lists  : {
            timeline : {
                name   : "Timeline",
                abbr   : "",
                uri    : "/home",
                tweets : [],
                unread : 0
            },
            
            notifications : {
                name   : "Notifications",
                abbr   : "",
                uri    : "/notifications",
                tweets : [],
                unread : 0
            }
        }
    });
    
    this.loadLists();
    this.loadTweets(this._state.active);
    this.streamUser();
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
                list,
                resp.users.map(function(user) {
                    return user.id_str;
                })
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
        console.log("Streaming %d user IDs", Object.keys(self._state.users).length);
        
        stream.on("data", function(tweet) {
            var list = self._state.users[tweet.user.id_str];
            
            // If we don't recognize the user it was probably someone
            // retweeting someone we do recognize. AKA we don't care.
            if(!list) {
                return;
            }
            
            console.log("Streaming Tweet:", tweet);
            
            self.addTweets(list, tweet);
        });
        
        stream.on("error", function(err) {
            console.log(err);
        });
    });
}, 500);

State.prototype.streamUser = function() {
    var self = this;
    
    twitter.stream("user", { stringify_friend_ids : true, replies : "all" }, function(stream) {
        console.log("Streaming User");
        
        stream.on("data", function(data) {
            console.log("User Stream data:", data);
            
            //self.addTweets(list, tweet);
        });
        
        stream.on("error", function(err) {
            console.log(err);
        });
    });
};

// Mutations
State.prototype.addList = function(list) {
    var id    = list.id_str,
        lists = {};
    
    lists[id] = {
        name   : list.name,
        uri    : list.uri,
        tweets : [],
        unread : 0,
        abbr   : list.name.length < 4 ?
            list.name :
            list.name
                .split(" ")
                .map(function(chunk) {
                    return chunk.slice(0, 1).toUpperCase();
                })
                .join("")
    };
    
    this._state = this._state.merge({
        lists : this._state.lists.merge(lists),
        order : this._state.order.concat([ id ])
    });
    
    // Go get users for this list to track
    this.loadUsers(id);
    
    this._changed();
};

State.prototype.addUsers = function(key, users) {
    var map = {};
    
    users.forEach(function(id) {
        map[id] = key;
    });
    
    this._state = this._state.merge({
        users : this._state.users.merge(map)
    });
    
    this.streamUsers();
    
    this._changed();
};

State.prototype.addTweets = function(key, tweets) {
    var list  = this._state.lists[key],
        lists = {};
        
    if(!Array.isArray(tweets)) {
        tweets = [ tweets ];
    }
    
    lists[key] = list.merge({
        tweets : tweets.concat(list.tweets),
        unread : this._state.active !== key ? list.unread + tweets.length : 0
    });
    
    if(lists[key].tweets.length > config.limits.tweets) {
        lists[key] = lists[key].merge({
            tweets : lists[key].tweets.slice(0, config.limits.tweets)
        });
    }
    
    this._state = this._state.merge({
        lists : this._state.lists.merge(lists)
    });
    
    this._changed();
};

State.prototype.selectList = function(key) {
    var list  = this._state.lists[key],
        lists = {};
    
    if(!list) {
        return this.selectList("timeline");
    }
    
    lists[key] = list.merge({
        unread : 0
    });
    
    this._state = this._state.merge({
        active : key,
        lists  : this._state.lists.merge(lists)
    });
    
    this._changed();
};

module.exports = new State();
