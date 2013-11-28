YUI.add("view-options", function(Y) {
    "use strict";
    
    var falco      = Y.namespace("Falco"),
        templates  = Y.namespace("Falco.Templates"),
        models     = Y.namespace("Falco.Models"),
        
        Options;
    
    Options = Y.Base.create("options", Y.View, [], {
        
        events : {
            ".logout" : {
                click : "_logoutClick"
            }
        },
        
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
                this.template({
                    user : models.user.toJSON()
                })
            );
            
            return this;
        },
        
        _logoutClick : function(e) {
            e.preventDefault();
            
            this.fire("logout");
        }
    });
    
    Y.namespace("Falco.Views").Options = Options;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Models
        "model-user",
        
        // Templates
        "template-options",
        
        // CSS
        "css-options"
    ]
});
