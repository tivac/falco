YUI.add("extension-list-users", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        streams = Y.namespace("Tristis.Streams"),
        ListUsers;
    
    ListUsers = function() {};
    
    ListUsers.prototype = {
        initializer : function() {
            this._handles.push(
                this.after([ "reset", "add" ], this._listUsers, this),
                streams.users.on("tweet", this._streamTweet, this)
            );
        },
        
        _listUsers : function() {
            var self = this;
            
            this._users = {};
            
            Y.batch.apply(
                this,
                this.map(function(list) {
                    return new Y.Promise(function(resolve, reject) {
                        var id = list.get("id_str");
                
                        // Ignore non-list timelines
                        if(!id) {
                            resolve();
                        }
                        
                        tristis.twitter.get("lists/members", {
                            list_id          : id,
                            include_entities : false,
                            skip_status      : true
                        }, function(err, resp) {
                            if(err) {
                                return reject(err);
                            }
                            
                            // update lookup object
                            resp.users.forEach(function(user) {
                                if(user.id_str in self._users) {
                                    self._users[user.id_str].push(id);
                                } else {
                                    self._users[user.id_str] = [ id ];
                                }
                            });
                            
                            resolve(resp.users.map(function(user) {
                                return user.id_str;
                            }));
                        });
                    });
                })
            ).then(
                function success(data) {
                    var ids = Y.Array.flatten(data);
                    
                    streams.users.ids(ids);
                },
                function failure(err) {
                    console.error(err);
                }
            );
        },
        
        _streamTweet : function(e) {
            console.log("Users stream tweet from a list", e.type, e);
        }
    };
    
    Y.namespace("Tristis.Extensions").ListUsers = ListUsers;
}, "@VERSION@", {
    requires : [
        // YUI
        "promise",
        "array-extras",
        
        // Streams
        "stream-users"
    ]
});
