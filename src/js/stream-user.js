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
            
            stream.on("tweet", this._tweet);
            
            this._stream = stream;
        },
        
        _tweet : function(data) {
            console.log("User._tweet", data, this);
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
