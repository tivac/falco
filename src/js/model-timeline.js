YUI.add("model-list-timeline", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        Timeline;
        
    Timeline = Y.Base.create("timeline", Y.LazyModelList, [], {
        
        //model : models.Tweet,
        
        initializer : function() {
            this._streamConnect();
        },
        
        destructor : function() {
            
        },
        
        _streamConnect : function() {
            var self = this;
            
            /*tristis.twitter.stream("statuses/sample", function(stream) {*/
            /*tristis.twitter.stream("user", function(stream) {
                stream.on("data",    self._streamEventData.bind(self));
                stream.on("end",     self._streamEventEnd.bind(self));
                stream.on("destroy", self._streamEventDestroy.bind(self));
            });*/
        },
        
        _streamEventData : function(data) {
            console.log("_streamEventData", data);
            
            // cases with no current plan to handle
            if(data.friends || data.limit || data.status_withheld || data.user_withheld || data.control || data.for_user) {
                return;
            }
            
            if(data.warning) {
                // TODO: Stalling... so?
                return;
            }
            
            if(data.delete) {
                // TODO: remove specified tweet
                return;
            }
            
            if(data.scrub_geo) {
                // TODO: remove loc data from specified tweet
                return;
            }
            
            if(data.target && data.source) {
                // TODO: Handle user events? Probably not
                return;
            }
            
            this.add(data);
        },
        
        _streamEventEnd : function(response) {
            console.log("_streamEventEnd", response);
        },
        
        _streamEventDestroy : function(response) {
            console.log("_streamEventDestroy", response);
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
