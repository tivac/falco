YUI.add("model-list-timelines", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        
        Timelines;
        
    Timelines = Y.Base.create("timelines", Y.ModelList, [
        Y.namespace("Tristis.Extensions").ListUsers
    ], {
        _home : new models.Home(),
        _mentions : new models.Mentions(),
        
        model : models.List,
        
        initializer : function() {
            this._handles = [
                this.after("*:tweets", this._tweetsEvent, this)
            ];
            
            this.publish("updated", { preventable : false });
            
            this.add(
                this._home,
                this._mentions
            );
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this.stop();
            
            this._handles = this._stream = this._tweetsEvent = null;
        },
        
        sync : function(action, options, done) {
            var self = this;
            
            if(action !== "read") {
                return done("Unsupported action");
            }
            
            tristis.twitter.get("lists/list", function(err, resp) {
                if(err) {
                    return done(err);
                }
                
                resp.unshift(self._home, self._mentions);
                
                done(null, resp);
            });
        },
        
        // Return the minimum fields required to sort things
        comparator : function(model) {
            return {
                id   : model.get("id"),
                slug : model.get("slug")
            };
        },
        
        // Override comparisons so things line up like so: home, mentions, lists in alphabetical order
        _compare : function(a, b) {
            // Home should be first
            if(a.id === "home") {
                return -1;
            }
            
            if(b.id === "home") {
                return 1;
            }
            
            // Mentions should be second
            if(a.id === "mentions") {
                return -1;
            }
            
            if(b.id === "mentions") {
                return 1;
            }
            
            // Everyone else is sorted by name
            return a.slug.localeCompare(b.slug);
        },
        
        // refire tweets
        _tweetsEvent : function(e) {
            this.fire("updated", {
                count : e.count,
                src   : e.target.get("id_str") || e.target.get("id")
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
        "model-timeline-list",
        
        // Extensions
        "extension-list-users"
    ]
});
