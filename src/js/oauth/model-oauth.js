YUI.add("model-oauth", function(Y) {
    "use strict";
    
    var conf = require("config").Twitter,
        Lib  = require("oauth").OAuth,
        OAuth, oauth;
    
    oauth = new Lib(
        "https://api.twitter.com/oauth/request_token",
        "https://api.twitter.com/oauth/access_token",
        conf.consumerKey,
        conf.consumerSecret,
        "1.0",
        "oob",
        "HMAC-SHA1"
    );
    
    OAuth = Y.Base.create("oauth", Y.Model, [], {
        initializer : function() {
            this.oauth = oauth;
        },
        
        requestToken : function(done) {
            var self = this;
            
            oauth.getOAuthRequestToken(
                function(error, token, secret) {
                    if(error) {
                        return done(error);
                    }
                    
                    self.token  = token;
                    self.secret = secret;
                    
                    done(null, token);
                }
            );
        },
        
        accessToken : function(pin, done) {
            var self = this;
            
            oauth.getOAuthAccessToken(this.token, this.secret, pin,
                function(error, access_token, access_secret){
                    if (error){
                        return done(error);
                    }
                    
                    // store access token/secret both in the model and in localstorage
                    localStorage.access_token  = access_token;
                    localStorage.access_secret = access_secret;
                    
                    self.token  = access_token;
                    self.secret = access_secret;
                    
                    done();
                }
            );
        }
    });
       
    Y.namespace("Falco.Models").OAuth = OAuth;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "model"
    ]
});
