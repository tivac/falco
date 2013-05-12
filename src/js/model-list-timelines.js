YUI.add("model-list-timelines", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        
        Timelines;
        
    Timelines = Y.Base.create("timelines", Y.ModelList, [], {
        model : models.List,
        
        initializer : function() {
            this._handles = [
                this.after({
                    "reset"    : this._listUsers,
                    "add"      : this._listUsers,
                    "*:tweets" : this._tweetsEvent
                }, null, this)
            ];
            
            this.publish("updated", { preventable : false });
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this.stop();
            
            this._handles = this._stream = this._tweetsEvent = null;
        },
        
        sync : function(action, options, done) {
            tristis.twitter.get("lists/list", function(err, resp) {
                if(err) {
                    return done(err);
                }
                
                resp.unshift(new models.Home(), new models.Mentions());
                
                done(null, resp);
            });
        },
        
        stream : function() {
            /*var self = this,
                stream;
            
            stream = tristis.twitter.stream("statuses/filter", {
                follow : Object.keys(this._users).join(",")
            });
            
            stream.on("tweet", function(data) {
                var user = data.user.id_str;
                
                // TODO: support retweets from the users we care about
                if(!self._users[user]) {
                    debugger;
                    
                    user = data.in_reply_to_user_id_str;
                    
                    if(!self._users[user]) {
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
            
            this._stream = stream;*/
        },
        
        stop : function() {
            if(this._stream) {
                this._stream.stop();
            }
        },
        
        // Override sorting so things line up how we like
        _compare : function(a, b) {
            // Home should be first
            if(a.get("id") === "home") {
                return 1;
            }
            
            if(b.get("id") === "home") {
                return -1;
            }
            
            // Mentions should be second
            if(a.get("id") === "mentions") {
                return 1;
            }
            
            if(b.get("id") === "mentions") {
                return -1;
            }
            
            // Everyone else is sorted by name
            return a.get("name").localCompare(b.get("name"));
        },
        
        _listUsers : function() {
            var self = this;
            
            this._users = {};
            
            // go get all the members of all the lists
            this.each(function(list) {
                var id = list.get("id_str");
                
                // Home timeline has its own stream, so ignore it
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
    
    models.Timelines = Timelines;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model-list",
        
        // Models
        "model-timeline-home",
        "model-timeline-mentions",
        "model-timeline-list"
    ]
});
