/*jshint maxparams:5, yui:true */
YUI.add("view-oauth", function(Y) {
    "use strict";

    var models    = Y.namespace("Falco.Models"),
        templates = Y.namespace("Falco.Templates"),
        
        OAuth;
    
    OAuth = Y.Base.create("oauth", Y.View, [], {
        events : {
            ".launch-auth" : {
                click : "_launchClick"
            },
            
            ".pin" : {
                submit : "_pinSubmit"
            }
        },
        
        render : function() {
            this.get("container").setHTML(templates["oauth-start"]());
            
            return this;
        },
        
        _launchClick : function(e) {
            e.preventDefault();
            
            models.oauth.requestToken(function(error, token) {
                if(error) {
                    return console.error(error);
                }
                
                require("nw.gui").Shell.openExternal(
                    "https://twitter.com/oauth/authenticate?oauth_token=" + token
                );
                
                this.get("container").setHTML(templates["oauth-pin"]());
            }.bind(this));
        },
        
        _pinSubmit : function(e) {
            var pin;
            
            e.preventDefault();
            
            pin = this.get("container").one("[name='pin']").get("value");
            
            models.oauth.accessToken(pin, function accessToken(error) {
                if(error) {
                    return console.error(error);
                }
                
                this.fire("linked");
            }.bind(this));
        }
    });
    
    Y.namespace("Falco.Views").OAuth = OAuth;

}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Models
        "model-oauth",
        
        // Templates
        "template-oauth-start",
        "template-oauth-pin",
        
        // CSS
        "css-oauth"
    ]
});
