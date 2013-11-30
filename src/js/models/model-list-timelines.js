/*jshint node:true, browser:true, yui:true */
YUI.add("model-list-timelines", function(Y) {
    "use strict";
    
    var falco = Y.namespace("Falco"),
        models  = Y.namespace("Falco.Models"),
        
        Timelines;
        
    Timelines = Y.Base.create("timelines", Y.ModelList, [
        Y.namespace("Falco.Extensions").ListUsers
    ], {
        _models : {
            home     : new models.Home(),
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
            
            // destroy all our component models
            this.each(function(timeline) {
                timeline.destroy();
            });
        },
        
        sync : function(action, options, done) {
            if(action !== "read") {
                done("Unsupported action");
            }
            
            // Todo: smarter sync impl that nicely mixes in defaults & also reads from "saved_searches/list"
            falco.twitter.get("lists/list", done);
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
                
                if(timeline.type !== "base") {
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
            
            // inject default timelines back in
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
                slug : model.get("slug"),
                type : model.get("type")
            };
        },
        
        // Override comparisons so things line up like so: home, mentions, lists in alphabetical order
        _compare : function(a, b) {
            // Same type? Sort on alpha
            if(a.type === b.type) {
                return a.slug.localeCompare(b.slug);
            }
            
            // Otherwise order is built-in timelines, lists, then searches
            if(a.type === "base") {
                return -1;
            }
            
            if(b.type === "base") {
                return 1;
            }
            
            if(a.type === "list") {
                return -1;
            }

            if(b.type === "list") {
                return 1;
            }

            if(a.type === "search") {
                return -1;
            }

            if(b.type === "search") {
                return 1;
            }
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
                model.load();
            });
        }
    }, {
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
        "model-timeline-search",
        
        // Extensions
        "extension-list-users"
    ]
});
