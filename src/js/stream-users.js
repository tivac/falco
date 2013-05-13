YUI.add("stream-users", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        streams = Y.namespace("Tristis.Streams"),
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
            
            stream = tristis.twitter.stream("status/filter", {
                follow : users.join(",")
            });
            
            stream.on("tweet", this._tweet);
            
            this._stream = stream;
        },
        
        _tweet : function(data) {
            console.log("Users._tweet", data, this);
        },
        
        ids : function() {
            var self = this,
                args = Array.prototype.splice.apply(arguments);
            
            args.forEach(function(id) {
                if(id in self._ids) {
                    return;
                }
                
                self._ids[id] = 1;
            });
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
