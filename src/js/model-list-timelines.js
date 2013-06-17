YUI.add("model-list-timelines", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        
        syncs   = Y.namespace("ModelSync"),
        
        Timelines;
        
    Timelines = Y.Base.create("timelines", Y.ModelList, [
        Y.namespace("Tristis.Extensions").ListUsers,
        
        // Sync Layers
        syncs.Lawnchair,
        syncs.Twitter,
        syncs.Multi
    ], {
        _models : {
            home : new models.Home(),
            mentions : new models.Mentions()
        },
        
        model : models.List,
        
        initializer : function() {
            this._handles = [
                this.after("*:tweets", this._tweetsEvent, this),
                this.after("reset", this._resetEvent, this)
            ];
            
            this.publish("updated", { preventable : false });
            
            this.add(Y.Object.values(this._models));
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = null;
            
            this.sync("update", { sync : "lawnchair" });
            
            // destroy all our component models
            this.each(function(timeline) {
                timeline.destroy();
            });
        },
        
        // Twitter sync implementation
        _twitterRead : function(options, done) {
            console.log("reading lists from twitter");
            
            tristis.twitter.get("lists/list", done);
        },
        
        parse : function(response) {
            if(!Array.isArray(response)) {
                response = response ? [ response ] : [];
            }
            
            // Make sure we use id_str everywhere
            response = response.map(function(timeline) {
                if(timeline.id_str) {
                    timeline.id = timeline.id_str;
                }
                
                return timeline;
            });
            
            // Filter out home & mentions, we need to update the existing objects correctly
            response = response.filter(function(timeline) {
                var id, tweets;
                
                if(timeline.id !== "home" && timeline.id !== "mentions") {
                    return true;
                }
                
                id = timeline.id;
                
                if(timeline.tweets) {
                    // Tweets are special!
                    tweets = timeline.tweets;
                    delete timeline.tweets;
                    
                    this._models[id].get("tweets").add(tweets);
                }
                
                this._models[id].setAttrs(timeline);
            }, this);
            
            response.unshift(this._models.home, this._models.mentions);
            
            return response;
        },
        
        // Timelines only serializes ids of lists in it, the lists themselves
        // serialize their contents
        serialize : function() {
            return this.map(function(timeline) {
                return { id : timeline.get("id") };
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
        
        // Refire tweets
        _tweetsEvent : function(e) {
            this.fire("updated", {
                count : e.count,
                src   : e.target.get("id_str") || e.target.get("id")
            });
        },
        
        // Have each timeline load its tweets
        _resetEvent : function(e) {
            e.models.forEach(function(model) {
                model.load({ sync : "lawnchair" });
                //model.get("tweets").load();
            });
        }
    }, {
        SYNCS : {
            "lawnchair" : syncs.Lawnchair,
            "twitter"   : syncs.Twitter
        },
        
        ATTRS : {
            name : {
                value : "Timelines"
            },
            
            id : {
                value : 1
            }
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
        
        // Model Sync Layers
        "model-sync-lawnchair",
        "model-sync-twitter",
        
        // Extensions
        "extension-list-users",
        
        // Gallery
        "gallery-model-sync-multi"
    ]
});
