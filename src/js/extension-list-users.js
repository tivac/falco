YUI.add("extension-list-users", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        streams = Y.namespace("Tristis.Streams"),
        ListUsers;
    
    ListUsers = function() {};
    
    ListUsers.prototype = {
        initializer : function() {
            this._handles.push(
                this.after([ "reset", "add" ], this._listUsers, this)
            );
        },
        
        _listUsers : function() {
            var self = this;
            
            this._users = {};
            
            // go get all the members of all the lists
            this.each(function(list) {
                var id = list.get("id_str");
                
                // Ignore non-list timelines
                if(!id) {
                    return;
                }
                
                tristis.twitter.get("lists/members", {
                    list_id          : id,
                    include_entities : false,
                    skip_status      : true
                }, function(err, resp) {
                    if(err) {
                        return console.error(err);
                    }
                    
                    // update lookup object
                    resp.users.forEach(function(user) {
                        if(user.id_str in self._users) {
                            self._users[user.id_str].push(id);
                        } else {
                            self._users[user.id_str] = [ id ];
                        }
                    });
                    
                    // Add these ids to be tracked
                    streams.users.ids.apply(streams.user, resp.users.map(function(user) {
                        return user.id_str;
                    }));
                });
            });
        },
    };
    
    Y.namespace("Tristis.Extensions").ListUsers = ListUsers;
}, "@VERSION@", {
    requires : [
        // Streams
        "stream-users"
    ]
});
