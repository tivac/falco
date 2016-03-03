"use strict";

var m         = require("mithril"),
    delegated = require("delegated"),
    
    // Electron
    shell     = require("shell"),
    clipboard = require("clipboard"),
    
    remote = require("remote"),
    Menu   = remote.require("menu"),
    
    // Libs
    state = require("../../lib/state"),
    data  = require("../../lib/tweet-data"),
    
    // Components
    tweet = require("../tweet/tweet"),
    
    menus = {
        _refs : {
            tweet : null,
            link  : null
        },
        
        tweet : Menu.buildFromTemplate([{
            label : "Open in browser",
            click : function() {
                var tgt = state.data.tweets[menus._refs.tweet],
                    src;
                
                if(!tgt) {
                    return;
                }
                
                src = data.source(tgt);
                
                shell.openExternal(`https://twitter.com/${src.user.screen_name}/status/${src.id_str}`);
            }
        }]),
        
        link : Menu.buildFromTemplate([{
            label : "Open in browser",
            click : function() {
                shell.openExternal(menus._refs.link);
            }
        }, {
            label : "Copy link location",
            click : function() {
                clipboard.writeText(menus._refs.link);
            }
        }])
    };

module.exports = {
    view : function() {
        var active = state.data.active;
        
        if(!(active in state.data.lists)) {
            return m(".error", "Unknown list: " + active);
        }
        
        return m(".current-list", {
                onclick : delegated({
                    "a.username" : function(e, a) {
                        e.preventDefault();
                    
                        return m.route("/user/" + a.getAttribute("data-screen-name"));
                    },
                    
                    "a" : function(e, a) {
                        e.preventDefault();
                        
                        shell.openExternal(a.getAttribute("href"));
                    }
                }),
                
                oncontextmenu : delegated({
                    ".tweet" : function(e, el) {
                        e.preventDefault();
                        
                        menus._refs.tweet = el.getAttribute("data-id");
                        
                        menus.tweet.popup(remote.getCurrentWindow());
                    },
                
                    "a" : function(e, a) {
                        e.preventDefault();
                        
                        menus._refs.link = a.getAttribute("href");
                        
                        menus.link.popup(remote.getCurrentWindow());
                    }
                })
            },
            state.data.lists[active].items.map(function tweetMarkup(item) {
                return m.component(tweet, {
                    key   : item.id_str,
                    tweet : state.data.tweets[item]
                });
            })
        );
    }
};
