YUI.add("model-list-timeline", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        Timeline;
        
    Timeline = Y.Base.create("timeline", Y.LazyModelList, [], {
        
        destructor : function() {
            this.stop();
            
            this._stream = null;
        },
        
        sync : function(action, options, done) {
            tristis.twitter.get("statuses/home_timeline", {
                count : 50,
                contributor_details : true
            }, done);
        },
        
        stream : function() {
            var self = this,
                stream;
            
            stream = tristis.twitter.stream("user", {
                with : "followings"
            });
            
            // Only caring about tweets atm
            stream.on("tweet", function(data) {
                self.add(data);
            });
            
            this._stream = stream;
        },
        
        stop : function() {
            if(this._stream) {
                this._stream.stop();
            }
        },
        
        comparator : function(model) {
            return Date.parse(model.created_at);
        }
    });
    
    models.Timeline = Timeline;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "lazy-model-list",
        
        // Models
        //"model-tweet"
    ]
});
