YUI.add("view-nav", function(Y) {
    "use strict";
    
    var tristis = Y.namespace("Tristis"),
        Nav;
    
    Nav = Y.Base.create("nav", Y.View, [], {
        
        template : Y.namespace("Tristis.Templates").nav,
        
        initializer : function() {
            this._handles = [
                tristis.user.on("change", this.render, this)
            ];
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = null;
        },
        
        render : function() {
            this.get("container").setHTML(
                this.template(
                    tristis.user.toJSON()
                )
            );
        }
    });
    
    Y.namespace("Tristis.Views").Nav = Nav;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Templates
        "template-nav"
    ]
});
