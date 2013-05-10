YUI.add("model-list-timeline", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        Timeline;
        
    Timeline = Y.Base.create("timeline", Y.LazyModelList, [], {
        
        destructor : function() {
            this.stop();
            this.stream = null;
        },
        
        start : function() {
            var self = this,
                stream;
            
            stream = tristis.twitter.stream("user");
            
            // Only caring about tweets atm
            stream.on("tweet", function(data) {
                self.add(data);
            });
            
            this.stream = stream;
        },
        
        stop : function() {
            if(this.stream) {
                this.stream.stop();
            }
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
