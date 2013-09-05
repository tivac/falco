YUI.add("view-nav", function(Y) {
    "use strict";
    
    var tristis   = Y.namespace("Tristis"),
        models    = Y.namespace("Tristis.Models"),
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
                models.user.after([ "change", "reset" ], this.render, this),
                models.timelines.after([ "change", "reset" ], this._renderLists, this)
            ];
            
            this.publish("url", {
                preventable : false
            });
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = this._urlEvent = null;
        },
        
        render : function() {
            this.get("container").setHTML(
                this.template({
                    user      : models.user.toJSON(),
                    timelines : models.timelines.toJSON(),
                    
                    _t : {
                        timelines : templates["nav-timelines"]
                    }
                })
            );
            
            this._renderLists();
        },
        
        updated : function(args) {
            var list = this.get("container").one("[data-id='" + args.id + "']"),
                count;
            
            // only update inactive links
            if(list.hasClass("active")) {
                return;
            }
            
            count = parseInt(list.getData("updates"), 10) || 0;
            
            console.log(args.id + " has " + (args.count + count) + " updates");
            
            list.setAttribute("data-updates", args.count + count);
        },
        
        _renderLists : function() {
            this.get("container").one(".timelines").setHTML(
                templates["nav-timelines"]({
                    timelines : models.timelines.toJSON(),
                    path      : tristis.app.getPath()
                })
            );
        },
        
        // DOM Events
        _navClick : function(e) {
            var target = e.target;
            
            e.preventDefault();
            
            this.get("container").all(".timeline").removeClass("active");
            
            target.ancestor(".timeline")
                .removeAttribute("data-updates")
                .addClass("active");
            
            this.fire("url", {
                // Using "getAttribute" here instead of "get" so we get the
                // actual value instead of an absolute URL
                url : target.getAttribute("href")
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
        "template-nav-timelines"
    ]
});
