YUI.add("extension-model-list-more", function(Y) {
    "use strict";
    
    var ModelListMore = function() {};
    
    ModelListMore.prototype = {
        more : function(options, callback) {
            var self = this;

            // Allow callback as only arg.
            if (typeof options === "function") {
                callback = options;
                options = {};
            }

            options || (options = {});

            this.sync("more", options, function (err, response) {
                var facade = {
                        options  : options,
                        response : response
                    },
                    parsed;

                if (err) {
                    facade.error = err;
                    facade.src = "more";

                    self.fire("error", facade);
                } else {
                    // Lazy publish.
                    if (!self._moreEvent) {
                        self._moreEvent = self.publish("more", {
                            preventable: false
                        });
                    }
                    
                    parsed = self.parse(response);
                    parsed = self.add(parsed, Y.merge(options, { silent : true }));
                    parsed = parsed.filter(function(item) {
                        return !!item;
                    });
                    
                    facade.parsed = parsed;
                        
                    self.fire("more", facade);
                }

                if(callback) {
                    callback.apply(null, arguments);
                }
            });

            return this;
        }
    };
    
    Y.namespace("Extensions").ModelListMore = ModelListMore;
    
});
