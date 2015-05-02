"use strict";

var m         = require("mithril"),
    delegated = require("delegated"),
    moment    = require("moment"),
    
    // Electron
    shell  = require("shell"),
    
    // Libs
    state   = require("../../lib/state"),
    tweet   = require("../../lib/tweet"),
    
    // Locals
    day    = moment().subtract(23, "hours"),
    year   = moment().subtract(12, "months");

function dateString(date) {
    date = moment(date).locale("en-twitter");
    
    if(date.isAfter(day)) {
        return date.fromNow(true);
    }
    
    if(date.isBefore(year)) {
        return date.format("D MMM YYYY");
    }
    
    return date.format("MMM D");
}

module.exports = {
    view : function() {
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
            // TODO: Break this out into components?
            list.items.asMutable().map(function tweetMarkup(item) {
                var src = tweet.source(item);
                
                return m(".tweet",
                    // Retweet Status
                    (item.retweeted_status ?
                        m("p.retweet",
                            m("a", {
                                    href : item.user.url
                                },
                                item.user.name
                            ),
                            " retweeted"
                        ) :
                        null
                    ),
                    // Main tweet content
                    m(".bd",
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
                                m(".time.part", dateString(item.created_at))
                            ),
                            m(".text", m.trust(tweet.text(src))),
                            src.entities.media ?
                                m(".images",
                                    src.entities.media.map(function(media) {
                                        return m("a", {
                                                href : media.expanded_url
                                            },
                                            m("img", {
                                                src   : media.media_url_https,
                                                title : media.display_url
                                            })
                                        );
                                    })
                                ) :
                                null
                        )
                    )
                );
            })
        );
    }
};
