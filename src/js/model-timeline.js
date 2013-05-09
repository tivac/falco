YUI.add("model-list-timeline", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        models  = Y.namespace("Tristis.Models"),
        Timeline;
        
    Timeline = Y.Base.create("timeline", [], {
        
        //model : models.Tweet,
        
        initializer : function() {
            this._streamConnect();
        },
        
        destructor : function() {
            
        },
        
        _streamConnect : function() {
            var self = this;
            
            tristis.twitter.stream("user", function(stream) {
                stream.on("data",    self._streamEventData);
                stream.on("end",     self._streamEventEnd);
                stream.on("destroy", self._streamEventDestroy);
            });
        },
        
        _streamEventData : function(data) {
            console.log("_streamEventData", data);
        },
        
        _streamEventEnd : function(response) {
            console.log("_streamEventEnd", response);
        },
        
        _streamEventDestroy : function(response) {
            console.log("_streamEventDestroy", response);
        }
    }, {
        
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
