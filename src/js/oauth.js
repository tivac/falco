/*jshint node:true, browser:true, jquery:true */

"use strict";

var conf  = require("config").Twitter,
    OAuth = require("oauth").OAuth,
    gui   = require("nw.gui"),
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

$(".oauth-start").click(function(e) {
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


$(".oauth-pin").submit(function(e) {
    var pin;
    
    e.preventDefault();
    
    pin = $("[name='pin']").val();
    
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
        }
    );
});
