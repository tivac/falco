"use strict";

var m      = require("mithril"),

    moment    = require("moment"),
    delegated = require("delegated"),
    
    shell  = require("shell"),
    
    state  = require("../../lib/state"),
    source = require("../../lib/tweet").source,
    
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
    view : function(ctrl) {
        var active = state.get("active"),
            list   = state.get("lists")[active];
        
        if(!list) {
            return m(".error", "Unknown list: " + active);
        }
        
        return m(".current-list", {
                onclick : delegated("a", function(e, a) {
                    e.preventDefault();
                    
                    if(a.matches(".username")) {
                        return m.route("/user/" + a.getAttribute("data-screen-name"));
                    }
                    
                    shell.openExternal(a.getAttribute("href"));
                })
            },
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
        );
    }
};
