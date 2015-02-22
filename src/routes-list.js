"use strict";

var m      = require("mithril"),

    moment = require("moment"),
    
    state  = require("./state"),
    parse  = require("./tweet").parse,
    source = require("./tweet").source,
    menu   = require("./menu"),
    
    day    = moment().startOf("day"),
    year   = moment().startOf("year").subtract(1, "year");

function dateString(date) {
    if(date.isAfter(day)) {
        return date.fromNow(true);
    }
    
    if(date.isBefore(year)) {
        return date.format("MMM D YYYY");
    }
    
    return date.format("MMM D");
}

exports.controller = function() {
    m.redraw.strategy("diff");
    
    this.list = m.route.param("list");
    
    state.selectList(this.list);
    
    // force a re-render once a minute to update timestamps
    this.interval = setInterval(m.redraw, 60000);
};

exports.controller.onunload = function() {
    clearInterval(this.interval);
};

exports.view = function(ctrl) {
    var list = state.get("lists")[ctrl.list];
    
    if(!list) {
        return [
            menu(),
            m(".error", "Unknown list: " + ctrl.list)
        ];
    }
    
    return [
        menu(),
        m(".content",
            list.tweets.asMutable().map(function(tweet) {
                var text = parse(tweet),
                    src  = source(tweet),
                    date = moment(Date.parse(src.created_at));
                
                return m(".tweet",
                    m(".icon",
                        m("img", {
                            src : src.user.profile_image_url_https
                        })
                    ),
                    m(".details",
                        m(".top.pure-g",
                            m(".name.pure-u", src.user.name),
                            m(".username.pure-u", "@" + src.user.screen_name),
                            m(".time.pure-u", dateString(date))
                        ),
                        m(".text", m.trust(text))
                    )
                );
            })
        )
    ];
};
