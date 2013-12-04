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
            
            ".list-slug" : {
                contextmenu : "_listMenu",
            },
            
            ".url" : {
                contextmenu : "_linkMenu"
            }
        },
        clipboard = gui.Clipboard.get(),
        Menus;
    
    Menus = function() {};
    Menus.prototype = {
        menus : {
            username : [
                { label : "User Details",  click : "_followLink" },
                { label : "User Mentions", click : "_userSearch" },
                { type  : "separator" },
                { label : "Copy Username", click : "_copyUser" },
                { label : "Copy User URL", click : "_copyLink" }
                
            ],
            
            hashtag : [
                { label : "Hashtag Tweets", click : "_followLink" },
                { type  : "separator" },
                { label : "Copy Hashtag",   click : "_copyText" }
            ],
            
            list : [
                { label : "Subscribe",      click : "_subscribeList" }
            ],
            
            link : [
                { label : "Open URL", click : "_followLink" },
                { type  : "separator" },
                { label : "Copy URL", click : "_copyLink" }
            ]
        },
        
        initializer : function() {
            this.events = Y.merge(this.events || {}, _events);
            
            this._menus = {};
        },
        
        // Menu setup
        _setupMenu : function(type) {
            var self = this,
                menu;
            
            if(this._menus[type]) {
                return this._menus[type];
            }
            
            menu = new gui.Menu();
            
            this._menus[type] = menu;
            
            this.menus[type].forEach(function(item) {
                if(item.click) {
                    item.click = self[item.click].bind(self);
                }
                
                menu.append(new gui.MenuItem(item));
            });
            
            return menu;
        },
        
        _showMenu : function(type, e) {
            e.preventDefault();
            
            // Store current element because node-webkit menu items don't know
            // anything about their state
            this._element = e.currentTarget;
            
            // Go get/create menu & show it at mouse position
            this._setupMenu(type).popup(e.clientX, e.clientY);
        },
        
        // Menu Events
        _followLink : function() {
            gui.Shell.openExternal(this._element.get("href"));
        },
        
        _copyLink : function() {
            clipboard.set(this._element.get("title"));
        },
        
        _copyText : function() {
            clipboard.set(this._element.get("text"));
        },
        
        _copyUser : function() {
            clipboard.set("@" + this._element.get("text"));
        },
        
        _userSearch : function() {
            gui.Shell.openExternal("https://twitter.com/search?q=" + encodeURIComponent(this._element.get("text")));
        },
        
        // DOM Events
        _usernameMenu : function(e) {
            this._showMenu("username", e);
            
            
        },
        
        _hashtagMenu : function(e) {
            this._showMenu("hashtag", e);
        },
        
        _linkMenu : function(e) {
            this._showMenu("link", e);
        },
    };
    
    Y.namespace("Falco.Extensions").TimelineMenus = Menus;
    
}, "@VERSION@", {
    requires : [
        "node-event-html5"
    ]
});
