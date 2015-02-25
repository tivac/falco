"use strict";

var twitter = require("twitter-text"),
    emoji   = require("./emoji");

exports.source = function(tweet) {
    return tweet.retweeted_status ? tweet.retweeted_status : tweet;
};

exports.parse = function(tweet) {
    var source = exports.source(tweet),
        text   = twitter.autoLinkWithJSON(
            source.text,
            source.entities
        );
        
    // respect newlines
    text = text.replace(/\n|\r\n|\r/g, "<br />");
    
    // emoji
    return emoji.parse(text);
};
