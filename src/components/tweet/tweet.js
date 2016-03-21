"use strict";

var m      = require("mithril"),
    moment = require("moment"),
    
    // Lib
    data   = require("../../lib/tweet-data"),
    
    // Locals
    day    = moment().subtract(23, "hours"),
    year   = moment().subtract(12, "months"),
    
    empty  = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

function dateString(date) {
    date = moment(Date.parse(date)).locale("en-twitter");
    
    if(date.isAfter(day)) {
        return date.fromNow(true);
    }
    
    if(date.isBefore(year)) {
        return date.format("D MMM YYYY");
    }
    
    return date.format("MMM D");
}

module.exports = {
    view : function(ctrl, args) {
        var tweet = args.tweet,
            src   = data.source(tweet),
            media = src.extended_entities ? src.extended_entities.media : [];
                
        return m(".tweet", {
                "data-id" : tweet.id_str
            },
            // Retweet Status
            (tweet.retweeted_status ?
                m("p.retweet",
                    m("a", {
                            href : tweet.user.url
                        },
                        tweet.user.name
                    ),
                    " retweeted"
                ) :
                null
            ),
            // Main tweet content
            m(".bd",
                m(".icon",
                    m("img.lazyload", {
                        src        : empty,
                        "data-src" : src.user.profile_image_url_https
                    })
                ),
                m(".details",
                    m(".top",
                        m(".name.part",
                            m("span.real", src.user.name),
                            m("span.user", "@" + src.user.screen_name)
                        ),
                        m(".time.part", dateString(tweet.created_at))
                    ),
                    m(".text", m.trust(data.text(src))),
                    src.entities.media ?
                        m(".images",
                            media.map(function(item) {
                                return m("a", {
                                        href : item.expanded_url
                                    },
                                    m("img.lazyload", {
                                        src        : empty,
                                        "data-src" : item.media_url_https,
                                        title      : item.display_url
                                    })
                                );
                            })
                        ) :
                        null
                )
            )
        );
    }
};
