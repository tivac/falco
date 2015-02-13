"use strict";

var m       = require("mithril"),
    twitter = require("twitter-text"),
    
    data = require("./data"),
    
    menu = require("./menu");

exports.controller = function() {
    this.list = m.route.param("list");
};

exports.view = function(ctrl) {
    var list = data.get("lists")[ctrl.list];
    
    return [
        menu(),
        m(".content",
            list.tweets.map(function(tweet) {
                return m(".tweet", tweet.text);
            })
        )
    ];
};
