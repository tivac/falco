"use strict";

var twitter = require("twitter-text"),
    twemoji = require("twemoji");

exports.parse = function(tweet) {
    return twemoji.parse(
        twitter.autoLinkWithJSON(
            tweet.text,
            tweet.entities
        ),
        function(icon, options, variant) {
            console.log(options);
            
            return "../node_modules/twemoji/svg/" + icon + ".svg";
        }
    );
}
