YUI.add("model-twitter-list", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        
        List;
        
    List = Y.Base.create("list", Y.Model, [], {
        initializer : function() {
            var tweets;
            
            tweets = new models.ListTweets({
                list_id : this.get("id")
            });
            
            this.set("tweets", tweets);
            
            this._handles = [
                tweets.after([ "reset", "more", "add" ], this._tweetAdd, this)
            ];
            
            this.publish("tweets", { preventable : false });
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = this._tweetsEvent = null;
        },
        
        sync : function(action, options, done) {
            tristis.twitter.get("lists/show", {
                list_id : this.get("id_str")
            }, done);
        },
        
        // Simple pass-through to tweets list
        more : function(options, done) {
            this.get("tweets").more(options, done);
        },
        
        // Override .toJSON() to make sure tweets are included
        toJSON : function() {
            var json = List.superclass.toJSON.apply(this);
            
            json.tweets = json.tweets.toJSON();
            
            return json;
        },
        
        _tweetAdd : function(e) {
            this.fire("tweets", {
                count : e.response.length || 1
            });
        }
    });
    
    models.List = List;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model",
        
        // Models
        "model-list-list-tweets"
    ]
});
