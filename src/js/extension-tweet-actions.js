YUI.add("extension-tweet-actions", function(Y) {
    "use strict";
    
    var _events = {
            ".actions .retweet" : {
                click : "_actionRetweet"
            }
        },
        Actions;
    
    Actions = function() {};
    Actions.prototype = {
        
        initializer : function() {
            this.events = Y.merge(this.events || {}, _events);
        },
        
        _actionRetweet : function(e) {
            var tweets, id, tweet;
            
            e.preventDefault();
            
            tweets = this.get("model").get("tweets");
            id     = e.target.ancestor(".tweet").getData("id");
            tweet  = tweets.getById(id);
        }
    };
    
    Y.namespace("Tristis.Extensions").TweetActions = Actions;
    
});
