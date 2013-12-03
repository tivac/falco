YUI.add("view-nav", function(Y) {
    "use strict";
    
    var falco     = Y.namespace("Falco"),
        models    = Y.namespace("Falco.Models"),
        templates = Y.namespace("Falco.Templates"),
        Nav;
    
    Nav = Y.Base.create("nav", Y.View, [], {
        
        events : {
            ".timelines a" : {
                click : "_timelineClick"
            },
            
            ".options a" : {
                click : "_optionsClick"
            }
        },
        
        template : templates.nav,
        
        initializer : function() {
            this._handles = [
                models.user.after([ "change", "reset" ], this.render, this),
            ];
            
            Y.Object.each(models.timelines, function(timelines) {
                this._handles.push(
                    timelines.after([ "change", "reset" ], this._renderTimelines, this)
                );
            }, this);
            
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
                    path      : falco.app.getPath(),
                    timelines : this._prepareTimelines(),
                    
                    _t : {
                        timeline  : templates["nav-timeline"],
                        timelines : templates["nav-timelines"]
                    }
                })
            );
            
            this._renderTimelines();
        },
        
        updated : function(args) {
            var list = this.get("container").one("[data-id='" + args.id + "']"),
                count;
            
            // only update inactive links
            if(list.hasClass(Nav.CSS.active)) {
                return;
            }
            
            count = parseInt(list.getData("updates"), 10) || 0;
            
            console.log(args.id + " has " + (args.count + count) + " updates");
            
            list.setAttribute("data-updates", args.count + count);
        },
        
        _prepareTimelines : function() {
            var json = {};
            
            Y.Object.each(models.timelines, function(timeline, name) {
                json[name] = timeline.toJSON();
            });
            
            return json;
        },
        
        _renderTimelines : function() {
            this.get("container").one(".timelines ul").setHTML(
                templates["nav-timelines"]({
                    timelines : this._prepareTimelines(),
                    path      : falco.app.getPath(),
                    
                    _t : {
                        timeline  : templates["nav-timeline"]
                    }
                })
            );
        },
        
        // DOM Events
        _timelineClick : function(e) {
            var target = e.target;
            
            e.preventDefault();
            
            this.get("container").all("." + Nav.CSS.active).removeClass(Nav.CSS.active);
            
            target.ancestor("li")
                .removeAttribute("data-updates")
                .addClass(Nav.CSS.active);
            
            this.fire("url", {
                // Using "getAttribute" here instead of "get" so we get the
                // actual value instead of an absolute URL
                url : target.getAttribute("href")
            });
        },
        
        _optionsClick : function(e) {
            var target = e.target;
            
            e.preventDefault();
            
            this.get("container").all("." + Nav.CSS.active).removeClass(Nav.CSS.active);
            
            target.ancestor("li")
                .addClass(Nav.CSS.active);
            
            this.fire("url", {
                // Using "getAttribute" here instead of "get" so we get the
                // actual value instead of an absolute URL
                url : target.getAttribute("href")
            });
        }
    }, {
        CSS : {
            active : "pure-menu-selected"
        }
    });
    
    Y.namespace("Falco.Views").Nav = Nav;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Templates
        "template-nav",
        "template-nav-timeline",
        "template-nav-timelines"
    ]
});
