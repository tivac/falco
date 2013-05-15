YUI.add("stream-user", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        streams = Y.namespace("Tristis.Streams"),
        User;
    
    User = function() {};
    
    User.prototype = {
        _create : function() {
            var stream;
            
            stream = tristis.twitter.stream("user", {
                with : "followings"
            });
            
            stream.on("tweet", this._tweet.bind(this));
            stream.on("friends", this._friends.bind(this));
            
            this._stream = stream;
        },
        
        _tweet : function(data) {
            this.fire("tweet", {
                tweet : data,
                src   : "user"
            });
        },
        
        _friends : function(data) {
            this.fire("friends", data.friends.map(function(id) {
                return {
                    id : id
                };
            }));
        }
    };
    
    Y.augment(User, streams.Base);
    
    streams.User = User;
    streams.user = new User();
    
}, "@VERSION@", {
    requires : [
        // YUI
        "oop",
        "event-custom",
        
        // Streams
        "stream-base"
    ]
});
