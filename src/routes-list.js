"use strict";

var m = require("mithril"),
    
    state = require("./state"),
    parse = require("./tweet").parse,
    menu  = require("./menu");

exports.controller = function() {
    this.list = m.route.param("list");
    
    state.selectList(this.list);
};

exports.view = function(ctrl) {
    var list = state.get("lists")[ctrl.list];
    
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
