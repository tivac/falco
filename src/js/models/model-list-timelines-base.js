YUI.add("model-list-timelines-base", function(Y) {
    "use strict";
    
    var TimelinesBase;
        
    TimelinesBase = Y.Base.create("timelines", Y.ModelList, [], {
        initializer : function() {
            this._handles = [
                this.after("*:tweets", this._tweetsEvent, this),
                this.after("reset", this._resetEvent, this)
            ];
            
            this.publish("updated", { preventable : false });
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = null;
            
            // destroy all our component models
            this.each(function(timeline) {
                timeline.destroy();
            });
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
            return model.get("slug");
        },
        
        // Compare by alpha
        _compare : function(a, b) {
            return a.localeCompare(b);
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
    });
    
    Y.namespace("Falco.Models").TimelinesBase = TimelinesBase;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model-list"
    ]
});
