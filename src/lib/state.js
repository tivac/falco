/*eslint camelcase:0, key-spacing:0 */
"use strict";

var EventEmitter = require("events").EventEmitter,
    util = require("util"),
    
    u        = require("updeep").default,
    debounce = require("lodash.debounce"),
    
    config  = require("./config"),
    twitter = require("./twitter");

function State() {
    this.data = u.freeze({
        active : "timeline",
        users  : {},
        order  : [
            "timeline",
            "notifications"
        ],
        lists  : {
            timeline : {
                name   : "Timeline",
                abbr   : "🏠",
                items  : [],
                unread : 0
            },
            
            notifications : {
                name   : "Notifications",
                abbr   : "🔔",
                items  : [],
                unread : 0
            }
        },
        tweets : {}
    });
    
    this.loadLists();
    
    this.loadTweets("timeline", {
        quiet : true
    });
    
    this.loadTweets("notifications", {
        quiet : true
    });
    
    this.streamUser();
}

util.inherits(State, EventEmitter);

// Util
State.prototype._changed = function() {
    this.emit("change", this.data);
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

State.prototype.loadTweets = function(list, options) {
    var self = this,
        args = {
            count       : 75,
            include_rts : true
        },
        url;
        
    if(list === "timeline") {
        url = "statuses/home_timeline";
    } else if(list === "notifications") {
        url = "statuses/mentions_timeline";
    } else {
        url = "lists/statuses";
        args.list_id = list;
    }
    
    twitter.get(url, args, function(err, tweets) {
        if(err) {
            return console.log(err);
        }
        
        self.addItems(list, tweets, options);
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
        users = Object.keys(this.data.users).join(",");
    
    // No changes, don't do anything
    if(users === this._users) {
        return;
    }
    
    this._users = users;
    
    twitter.stream("statuses/filter", { follow : users }, function(stream) {
        console.log("Streaming %d user IDs", Object.keys(self.data.users).length);
        
        stream.on("data", function(tweet) {
            var list = self.data.users[tweet.user.id_str];
            
            // If we don't recognize the user it was probably someone
            // retweeting someone we do recognize. AKA we don't care.
            if(!list) {
                return;
            }
            
            self.addItems(list, tweet);
        });
        
        stream.on("error", function(err) {
            console.error(err);
        });
    });
}, 500);

State.prototype.streamUser = function() {
    var self = this;
    
    twitter.stream("user", { stringify_friend_ids : true, replies : "all" }, function(stream) {
        console.log("Streaming User");
        
        stream.on("data", function(data) {
            console.log("User Stream data:", data);
            
            // TODO: Add follow/favorite events to notifications
            
            // Filter out non-tweets
            // TODO: retweet_count is kinda random, need better heuristic
            if(!data.hasOwnProperty("id_str") || !data.hasOwnProperty("retweet_count")) {
                return;
            }
            
            self.addItems("timeline", data);
        });
        
        stream.on("error", function(err) {
            console.error(err);
        });
    });
};

// Mutations
State.prototype.addList = function(list) {
    var id    = list.id_str,
        lists = {};
    
    this.data = u({
        lists : {
            [list.id_str] : {
                name   : list.name,
                items  : [],
                unread : 0,
                abbr   : list.name.length < 4 ?
                    list.name :
                    list.name
                        .split(" ")
                        .map(function(chunk) {
                            return chunk.slice(0, 1).toUpperCase();
                        })
                        .join("")
            }
        },
        order : function(order) {
            return [].concat(order, [id]);
        }
    }, this.data);
    
    // Go get users for this list to track
    this.loadUsers(id);
    
    // Go get tweets for this list
    this.loadTweets(id, {
        quiet : true
    });
    
    this._changed();
};

State.prototype.addUsers = function(key, users) {
    var map = {};
    
    users.forEach(function(id) {
        map[id] = key;
    });

    this.data = u({
        users : map 
    }, this.data);
    
    this.streamUsers();
    
    this._changed();
};

State.prototype.addItems = function(key, items, options) {
    var list   = this.data.lists[key],
        tweets = {},
        shown;
    
    if(!options) {
        options = {};
    }
        
    if(!Array.isArray(items)) {
        items = [ items ];
    }
    
    // Ensure that all items are valid
    items = items.filter(function(item) {
        if(!item) {
            return false;
        }
        
        // Build up tweets object
        tweets[item.id_str] = item;
        
        return true;
    });
    
    shown = this.data.active !== key && !options.quiet;
    
    this.data = u({
        tweets : tweets,
        lists  : {
            [key] : {
                items : function(current) {
                    return [].concat(current, items.map(function(item) {
                        return item.id_str;
                    }));
                },
                
                unread : function(val) {
                    return shown ? val + items.length : 0;
                }
            }
        }
    }, this.data);
    
    this._changed();
};

State.prototype.selectList = function(key) {
    var list = this.data.lists[key];
    
    if(!list) {
        return this.selectList("timeline");
    }
    
    this.data = u({
        active : key,
        lists  : {
            [key] : {
                unread : 0
            }
        }
    }, this.data);
    
    this._changed();
};

module.exports = new State();
