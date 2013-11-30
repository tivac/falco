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
                    path      : falco.app.getPath(),
                    timelines : this._organizeTimelines(),
                    
                    _t : {
                        timeline  : templates["nav-timeline"],
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
            if(list.hasClass(Nav.CSS.active)) {
                return;
            }
            
            count = parseInt(list.getData("updates"), 10) || 0;
            
            console.log(args.id + " has " + (args.count + count) + " updates");
            
            list.setAttribute("data-updates", args.count + count);
        },
        
        _organizeTimelines : function() {
            var timelines = {
                    base   : [],
                    list   : [],
                    search : []
                };
            
            models.timelines.toJSON().forEach(function(timeline) {
                timelines[timeline.type].push(timeline);
            });
            
            if(timelines.list.length) {
                timelines.list[0].divider = true;
            }
            
            if(timelines.search.length) {
                timelines.search[0].divider = true;
            }
            
            return timelines;
        },
        
        _renderLists : function() {
            this.get("container").one(".timelines ul").setHTML(
                templates["nav-timelines"]({
                    timelines : this._organizeTimelines(),
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
