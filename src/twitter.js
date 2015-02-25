"use strict";

var config = require("./config");

module.exports = new require("twitter")({
    consumer_key        : config.twitter.consumer.key,
    consumer_secret     : config.twitter.consumer.secret,
    access_token_key    : config.twitter.access.token,
    access_token_secret : config.twitter.access.secret
});
