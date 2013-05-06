/*jshint maxparams:5 */
YUI.add("auth", function(Y) {
    "use strict";

    var conf    = require("config").Twitter,
        OAuth   = require("oauth").OAuth,
        gui     = require("nw.gui"),
        Chirrup = global.Chirrup,
        oauth, win;

    oauth = new OAuth(
        "https://api.twitter.com/oauth/request_token",
        "https://api.twitter.com/oauth/access_token",
        conf.consumerKey,
        conf.consumerSecret,
        "1.0",
        "oob",
        "HMAC-SHA1"
    );

    Y.one(".oauth-start").on("click", function(e) {
        e.preventDefault();
        
        oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
            if(error) {
                console.error(error);
                
                return;
            }
            
            localStorage.oauth_token = oauth_token;
            localStorage.oauth_token_secret = oauth_token_secret;
            
            win = gui.Window.get(
                window.open(
                    "https://twitter.com/oauth/authenticate?oauth_token=" + oauth_token
                )
            );
        });
    });


    Y.one(".oauth-pin").on("submit", function(e) {
        var pin;
        
        e.preventDefault();
        
        pin = Y.one("[name='pin']").get("value");
        
        oauth.getOAuthAccessToken(localStorage.oauth_token, localStorage.oauth_token_secret, pin,
            function(error, oauth_access_token, oauth_access_token_secret, results){
                console.log(arguments);
                
                if (error){
                    return console.log(error);
                }
                
                // close oAuth pin window, we're good
                win.close();
                
                localStorage.oauth_access_token = oauth_access_token;
                localStorage.oauth_access_token_secret = oauth_access_token_secret;
                
                Chirrup.showTwitter();
            }
        );
    });

}, "@VERSION@", {
    requires : [
        "node"
    ]
});
