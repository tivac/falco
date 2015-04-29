"use strict";

var m         = require("mithril"),
    delegated = require("delegated"),
    moment    = require("moment"),
    
    // Electron
    shell  = require("shell"),
    
    // Libs
    state  = require("../../lib/state"),
    source = require("../../lib/tweet").source,
    
    // Locals
    day    = moment().subtract(23, "hours"),
    year   = moment().subtract(12, "months");

function dateString(date) {
    if(date.isAfter(day)) {
        return date.fromNow(true);
    }
    
    if(date.isBefore(year)) {
        return date.format("D MMM YYYY");
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
                    date = moment(src.created_at).locale("en-twitter");
                
                return m(".tweet",
                    m(".icon",
                        m("img", {
                            src : src.user.profile_image_url_https
                        })
                    ),
                    m(".details",
                        m(".top",
                            m(".name.part",
                                m("span.real", src.user.name),
                                m("span.user", "@" + src.user.screen_name)
                            ),
                            m(".time.part", dateString(date))
                        ),
                        m(".text", m.trust(src.html))
                    )
                );
            })
        );
    }
};
