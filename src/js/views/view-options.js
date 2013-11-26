YUI.add("view-options", function(Y) {
    "use strict";
    
    var falco      = Y.namespace("Falco"),
        templates  = Y.namespace("Falco.Templates"),
        
        Options;
    
    Options = Y.Base.create("options", Y.View, [], {
        template : templates.options,
        
        initializer : function() {
            this._handles = [];
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = null;
        },
        
        render : function() {
            this.get("container").setHTML(
                this.template()
            );
            
            return this;
        },
        
    });
    
    Y.namespace("Falco.Views").Options = Options;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Templates
        "template-options",
        
        // CSS
        "css-options"
    ]
});
