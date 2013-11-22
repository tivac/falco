YUI.add("extension-list-users", function(Y) {
    "use strict";
    
    var async = require("async"),
    
        tristis = Y.namespace("Tristis"),
        streams = Y.namespace("Tristis.Streams"),
        
        ListUsers;
    
    ListUsers = function() {};
    
    ListUsers.prototype = {
        initializer : function() {
            this._handles.push(
                this.after([ "reset", "add" ], this._listUsers, this),
                streams.users.on("tweet", this._streamTweet, this),
                streams.user.on("tweet",  this._streamTweet, this)
            );
            
            this._users = {};
        },
        
        _listUsers : function() {
            var self = this;
            
            async.map(
                this.toArray(),
                function(timeline, done) {
                    var id = timeline.get("id");
                    
                    // Ignore non-list timelines
                    if(timeline.get("type") !== "list") {
                        return done();
                    }
                    
                    tristis.twitter.get("lists/members", {
                        list_id          : id,
                        include_entities : false,
                        skip_status      : true
                    }, function(err, resp) {
                        if(err) {
                            return done(err);
                        }
                        
                        // update lookup object
                        resp.users.forEach(function(user) {
                            if(user.id_str in self._users) {
                                self._users[user.id_str].push(id);
                            } else {
                                self._users[user.id_str] = [ id ];
                            }
                        });
                        
                        done(null, resp.users.map(function(user) {
                            return user.id_str;
                        }));
                    });
                },
                function(err, results) {
                    if(err) {
                        return console.error(err);
                    }
                    
                    streams.users.ids(Y.Array.flatten(results));
                }
            );
        },
        
        _streamTweet : function(e) {
            var self = this,
                lists = this._users[e.tweet.user.id_str];
            
            if(!lists) {
                return;
            }
            
            lists.forEach(function(list) {
                self.getById(list).get("tweets").add(e.tweet);
            });
        }
    };
    
    Y.namespace("Tristis.Extensions").ListUsers = ListUsers;
}, "@VERSION@", {
    requires : [
        // YUI
        "array-extras",
        
        // Streams
        "stream-users"
    ]
});
