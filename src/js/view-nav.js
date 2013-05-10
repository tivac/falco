YUI.add("view-nav", function(Y) {
    "use strict";
    
    var models    = Y.namespace("Tristis.Models"),
        templates = Y.namespace("Tristis.Templates"),
        Nav;
    
    Nav = Y.Base.create("nav", Y.View, [], {
        
        events : {
            "a" : {
                click : "_navClick"
            }
        },
        
        template : templates.nav,
        
        initializer : function() {
            this._handles = [
                models.user.after("change", this.render, this),
                models.lists.after([ "change", "reset" ], this._renderLists, this)
            ];
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = this._linkEvent = null;
        },
        
        render : function() {
            this.get("container").setHTML(
                this.template({
                    user : models.user.toJSON()
                })
            );
            
            this._renderLists();
        },
        
        _renderLists : function() {
            this.get("container").one(".lists").setHTML(
                templates["nav-lists"]({
                    lists : models.lists.toJSON()
                })
            );
        },
        
        // DOM Events
        _navClick : function(e) {
            e.preventDefault();
            
            if(!this._linkEvent) {
                this._linkEvent = this.publish("link", {
                    preventable : false
                });
            }
            
            
            this.fire("link", {
                // Using "getAttribute" here instead of "get" so we get the
                // actual value instead of an absolute URL
                url : e.target.getAttribute("href")
            });
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
