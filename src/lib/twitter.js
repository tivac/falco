/*eslint camelcase:0 */
"use strict";

var config  = require("./config"),
    Twitter = require("twitter");

module.exports = new Twitter({
    consumer_key        : config.twitter.consumer.key,
    consumer_secret     : config.twitter.consumer.secret,
    access_token_key    : config.twitter.access.token,
    access_token_secret : config.twitter.access.secret
});
