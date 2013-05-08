/*jshint maxparams:5 */
YUI.add("view-link", function(Y) {
    "use strict";

    var models = Y.namespace("Tristis.Models"),
        Link;
    
    Link = Y.Base.create("link", Y.View, [], {
        css      : "oauth",
        template : Y.namespace("Tristis.Templates")["oauth-link"],
        
        events : {
            ".start" : {
                click : "_startClick"
            },
            
            ".pin" : {
                submit : "_pinSubmit"
            }
        },
        
        initializer : function() {
            
        },
        
        render : function() {
            this.get("container").setHTML(this.template());
            
            return this;
        },
        
        _startClick : function(e) {
            var self = this;
            
            e.preventDefault();
            
            models.oauth.requestToken(function(error, token) {
                if(error) {
                    return console.error(error);
                }
                
                self.win = require("nw.gui").Window.get(
                    window.open(
                        "https://twitter.com/oauth/authenticate?oauth_token=" + token
                    )
                );
            });
        },
        
        _pinSubmit : function(e) {
            var self = this,
                pin;
            
            e.preventDefault();
            
            pin = this.get("container").one("[name='pin']").get("value");
            
            models.oauth.accessToken(pin, function(error) {
                if(error) {
                    return console.error(error);
                }
                
                // close twitter window
                self.win.close();
                
                self.fire("linked");
            });
        }
    });
    
    Y.namespace("Tristis.Views").Link = Link;

}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Models
        "model-oauth",
        
        // Templates
        "template-oauth-link"
    ]
});
