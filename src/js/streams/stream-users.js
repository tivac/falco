YUI.add("stream-users", function(Y) {
    "use strict";
    
    var falco = Y.namespace("Falco"),
        streams = Y.namespace("Falco.Streams"),
        Users;
    
    Users = function() {};
    
    Users.prototype = {
        _ids   : {},
        
        _create : function() {
            var users = Object.keys(this._ids),
                stream;
            
            if(!users.length) {
                return;
            }
            
            stream = falco.twitter.stream("statuses/filter", {
                follow : users
            });
            
            stream.on("tweet", this._tweet.bind(this));
            
            this._stream = stream;
        },
        
        _tweet : function(data) {
            if(!this._ids[data.user.id_str]) {
                return;
            }
            
            this.fire("tweet", {
                tweet : data,
                src   : "users"
            });
        },
        
        ids : function(ids) {
            var self = this;
            
            // if the first argument isn't an array assume we got called like
            // ids(id, ..., id) & turn that into an array
            if(!Array.isArray(ids)) {
                ids = Array.prototype.splice.apply(arguments);
            }
            
            ids.forEach(function(id) {
                if(!id || (id in self._ids)) {
                    return;
                }
                
                self._ids[id] = 1;
            });
            
            this.start();
        }
    };
    
    Y.augment(Users, streams.Base);
    
    streams.Users = Users;
    streams.users = new Users();
    
}, "@VERSION@", {
    requires : [
        // YUI
        "oop",
        "event-custom",
        
        // Streams
        "stream-base"
    ]
});
