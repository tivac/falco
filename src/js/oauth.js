/*jshint node:true */

"use strict";

var conf  = require("config").Twitter,
    OAuth = require("oauth").OAuth,
    oauth;

oauth = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    conf.consumerKey,
    conf.consumerSecret,
    "1.0",
    "http://yourdomain/auth/twitter/callback",
    "HMAC-SHA1"
);

// TODO: something useful with this
