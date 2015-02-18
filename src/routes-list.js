"use strict";

var m = require("mithril"),
    
    data  = require("./data"),
    parse = require("./tweet").parse,
    menu  = require("./menu");

exports.controller = function() {
    this.list = m.route.param("list");
    
    data.selectList(this.list);
};

exports.view = function(ctrl) {
    var list = data.get("lists")[ctrl.list];
    
    if(!list) {
        return [ menu(), m(".error", "Unknown list: " + ctrl.list) ];
    }
    
    return [
        menu(),
        m(".content",
            list.tweets.asMutable().map(function(tweet) {
                var text = parse(tweet);
                
                return m(".tweet", m.trust(text));
            })
        )
    ];
};
