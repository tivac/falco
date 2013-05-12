YUI.add("model-list-lists", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        
        Lists;
        
    Lists = Y.Base.create("lists", Y.ModelList, [], {
        model : models.List,
        
        initializer : function() {
            this._handles = [
                this.after({
                    "reset"    : this._usersLookup,
                    "*:tweets" : this._tweetsEvent
                }, null, this)
            ];
            
            this.publish("updated", { preventable : false })
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this.stop();
            
            this._handles = this._stream = this._tweetsEvent = null;
        },
        
        sync : function(action, options, done) {
            
            tristis.twitter.get("lists/list", done);
        },
        
        stream : function() {
            var self = this,
                stream;
            
            stream = tristis.twitter.stream("statuses/filter", {
                follow : Object.keys(this._users).join(",")
            });
            
            stream.on("tweet", function(data) {
                var user = data.user.id_str;
                
                // TODO: support retweets from the users we care about
                if(!self._users[user]) {
                    debugger;
                    
                    /*user = data.in_reply_to_user_id_str;
                    
                    if(!self._users[user]) {*/
                        return console.error("Unknown user tweet, not in any lists.", data);
                    //}
                }
                
                // update all lists this user is a member of
                self._users[user].forEach(function(id) {
                    var list = self.getById(id);
                    
                    if(!list) {
                        return console.error("Unknown list", id);
                    }
                    
                    list.get("tweets").add(data);
                });
            });
            
            this._stream = stream;
        },
        
        stop : function() {
            if(this._stream) {
                this._stream.stop();
            }
        },
        
        _usersLookup : function() {
            var self = this;
            
            this._users = {};
            
            // go get all the members of all the lists
            this.each(function(list) {
                var id = list.get("id_str");
                
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
                });
            });
        },
        
        // refire tweets
        _tweetsEvent : function(e) {
            this.fire("updated", {
                count  : e.count,
                type   : "list",
                source : e.target.get("id_str")
            });
        }
    });
    
    models.Lists = Lists;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model-list",
        
        // Models
        "model-twitter-list"
    ]
});
