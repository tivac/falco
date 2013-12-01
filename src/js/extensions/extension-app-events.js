YUI.add("extension-app-events", function(Y) {
    "use strict";
    
    var gui = require("nw.gui"),
        win = gui.Window.get(),
        
        falco   = Y.namespace("Falco"),
        models  = Y.namespace("Falco.Models"),
        streams = Y.namespace("Falco.Streams"),
        
        Events;
    
    Events = function() {};
    Events.prototype = {
        // App-level DOM events
        events : {
            "[data-external]" : {
                click : "_eventExternalClick"
            }
        },
        
        initializer : function() {
            this._handles = [
                this.on({
                    "*:linked" : this._linkedEvent,
                    "*:url"    : this._urlEvent,
                    "*:logout" : this._logoutEvent
                }, null, this)
            ];
            
            win.on("close", this._closeEvent.bind(this));
            
            // Have to adjust this based on main app startup flow
            if(models.timelines) {
                this._eventsSetup();
            } else {
                Y.Do.after(this._eventsSetup, this, "_setup", this);
            }
        },
        
        // Called after main app's _setup fn
        _eventsSetup : function() {
            this._handles.push(
                streams.user.on("friends", this._friendsEvent, this)
            );
            
            Y.Object.each(models.timelines, function(timelines) {
                this._handles.push(
                    timelines.on("updated", this._updatedEvent, this)
                );
            }, this);
        },
        
        // DOM events
        _eventExternalClick : function(e) {
            e.preventDefault();
            
            gui.Shell.openExternal(e.currentTarget.get("href"));
        },
        
        // YUI events
        
        // TODO: more?
        _linkedEvent : function() {
            this._setup();
        },
        
        _urlEvent : function(e) {
            this.navigate(e.url);
        },
        
        _updatedEvent : function(e) {
            this.get("children").nav.updated({
                id    : e.src,
                count : e.count
            });
        },
        
        _friendsEvent : function(friends) {
            models.friends = new models.Friends({
                items : friends
            });
        },
        
        _logoutEvent : function() {
            localStorage.removeItem("access_token");
            localStorage.removeItem("access_secret");
            
            // We log you out by closing the app. Maybe something more interesting can be done later
            win.close();
        },
        
        // Node-Webkit events
        _closeEvent : function() {
            this.destroy();
        }
    };
    
    Y.namespace("Falco.Extensions").Events = Events;
    
}, "@VERSION@", {
    requires : [
        "stream-user",
        "model-list-friends"
    ]
});
