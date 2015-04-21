"use strict";

var m      = require("mithril"),

    moment = require("moment"),
    
    state  = require("../lib/state"),
    source = require("../lib/tweet").source,
    menu   = require("../lib/menu"),
    
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

module.exports = {
    controller : function() {
        var ctrl = this;
        
        m.redraw.strategy("diff");
        
        ctrl.list = m.route.param("list");
        
        state.selectList(ctrl.list);
        
        // force a re-render once a minute to update timestamps
        ctrl.interval = setInterval(m.redraw, 60000);
        
        // Clear that same interval when the controller unloads
        ctrl.onunload = function() {
            clearInterval(ctrl.interval);
        };
    },

    view : function(ctrl) {
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
                // Call to asMutable here is necessary to prevent weirdness w/ mithril interactions
                list.items.asMutable().map(function tweetMarkup(tweet) {
                    var src  = source(tweet),
                        date = moment(src.created_at);
                    
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
                            m(".text", m.trust(src.html))
                        )
                    );
                })
            )
        ];
    }
};
