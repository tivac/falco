/*jshint node:true, browser:true, jquery:true */

"use strict";

var conf    = require("config").Twitter,
    Twitter = require("ntwitter"),
    Chirrup = global.Chirrup,
    twitter;
    
twitter = new Twitter({
    consumer_key        : conf.consumerKey,
    consumer_secret     : conf.consumerSecret,
    access_token_key    : localStorage.oauth_access_token,
    access_token_secret : localStorage.oauth_access_token_secret
});


Chirrup.twitter = twitter;

twitter.verifyCredentials(function(err, data) {
    if(err) {
        return console.error(err);
    }
    
    $(".twitter").append("<img src='" + data.profile_image_url + "' />");
});

/*twitter.stream("statuses/sample", function(stream) {
    stream.on("data", function (data) {
        console.log(data);
    });
});*/
