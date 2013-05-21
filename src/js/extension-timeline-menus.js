YUI.add("extension-timeline-menus", function(Y) {
    "use strict";
    
    var gui     = require("nw.gui"),
        _events = {
            ".username" : {
                contextmenu : "_usernameMenu"
            },
            
            ".hashtag" : {
                contextmenu : "_hashtagMenu"
            },
            
            ".tweet a:not(.tweet-url)" : {
                contextmenu : "_linkMenu"
            }
        },
        clipboard = gui.Clipboard.get(),
        Menus;
    
    Menus = function() {};
    Menus.prototype = {
        initializer : function() {
            this.events = Y.merge(this.events || {}, _events);
            this._menus = {};
        },
        
        // Menu setup
        _setupUsernameMenu : function() {
            var menu = new gui.Menu();
            
            menu.append(new gui.MenuItem({
                label : "User Details"
            }));
            
            menu.append(new gui.MenuItem({
                label : "Copy Username"
            }));
            
            menu.append(new gui.MenuItem({
                label : "Search for User"
            }));
            
            this._menus.username = menu;
            
            return menu;
        },
        
        // Menu Events
        
        
        // DOM Events
        _usernameMenu : function(e) {
            var menu;
            
            e.preventDefault();
            
            console.log("user name", e);
            
            menu = this._menus.username;
            
            if(!menu) {
                menu = this._setupUsernameMenu();
            }
            
            menu.popup(e.clientX, e.clientY);
        },
        
        _hashtagMenu : function(e) {
            e.preventDefault();
            
            console.log("hash tag", e);
        },
        
        _linkMenu : function(e) {
            e.preventDefault();
            
            console.log("link", e);
        },
    };
    
    Y.namespace("Tristis.Extensions").TimelineMenus = Menus;
    
}, "@VERSION@", {
    requires : [
        "node-event-html5"
    ]
});
