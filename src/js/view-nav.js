YUI.add("view-nav", function(Y) {
    "use strict";
    
    var tristis   = Y.namespace("Tristis"),
        templates = Y.namespace("Tristis.Templates"),
        Nav;
    
    Nav = Y.Base.create("nav", Y.View, [], {
        
        template : templates.nav,
        
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
                this.template({
                    user : tristis.user.toJSON()
                })
            );
        },
        
        _renderLists : function(e) {
            
        }
    });
    
    Y.namespace("Tristis.Views").Nav = Nav;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Templates
        "template-nav",
        "template-nav-lists"
    ]
});
