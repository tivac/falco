YUI.add("view-timeline", function(Y) {
    "use strict";
    
    var moment     = require("moment"),
        text       = require("twitter-text"),
        
        falco      = Y.namespace("Falco"),
        extensions = Y.namespace("Falco.Extensions"),
        templates  = Y.namespace("Falco.Templates"),
        
        _options, _newlineRegex, _nl2br, Timeline;
    
    _options = {
        "data-external" : ""
    };
    
    _newlineRegex = /(?:\r\n|\n|\r)/g;
    _nl2br = function(txt) {
        return txt.replace(_newlineRegex, "<br />");
    };
    
    moment.lang("en", {
        relativeTime : {
            // our custom values
            s  : "%ds",
            m  : "1m",
            mm : "%dm",
            h  : "1h",
            hh : "%dh",
            
            // default moment.js values
            future : "in %s",
            past   : "%s ago",
            d      : "a day",
            dd     : "%d days",
            M      : "a month",
            MM     : "%d months",
            y      : "a year",
            yy     : "%d years"
        }
    });
    
    Timeline = Y.Base.create("timeline", Y.View, [
        extensions.TimelineMenus,
        extensions.TweetActions
    ], {
        template : templates.timeline,
        
        initializer : function() {
            var model = this.get("model");
            
            this._handles = [
                model.after("reset", this.render, this),
                model.get("tweets").after([ "reset", "add", "more" ], this._renderUpdate, this)
            ];
        },
        
        destructor : function() {
            new Y.EventTarget(this._handles).detach();
            
            this._handles = null;
        },
        
        render : function() {
            var timeline = this.get("model").toJSON();
            
            this.get("container").setHTML(
                this.template(
                    Y.merge(
                        timeline,
                        {
                            tweets : this._renderTweets(timeline.tweets),
                            _t     : templates
                        }
                    )
                )
            );
            
            this.rendered = true;
            
            return this;
        },
        
        _renderUpdate : function(e) {
            var container, list, models, now, updates, scrolled;
            
            if(!this.rendered) {
                return this.render();
            }
            
            models  = e.models || e.parsed || [ e.model ];
            updates = models.length;
            
            container = this.get("container");
            list      = container.one(".tweets");
            
            scrolled = container.get("scrollHeight") - container.get("scrollTop");
            
            list.prepend(
                this._renderTweets(models)
            );
            
            if(scrolled) {
                container.set("scrollTop", container.get("scrollHeight") - scrolled);
            }
            
            if(updates === this.get("model").get("tweets").size()) {
                return;
            }
            
            now = moment();
            
            // Update timestamps for all other tweets
            this.get("model").get("tweets").each(function(tweet, idx) {
                var el;
                
                // skip the models we just rendered
                if(idx < updates) {
                    return;
                }
                
                el = list.one("[data-id='" + tweet.id_str + "'] .time");
                el.setHTML(this._tweetDate(now, tweet));
            }.bind(this));
        },
        
        _renderTweets : function(tweets) {
            var self = this,
                now  = moment();
            
            return tweets.reduce(function(prev, tweet) {
                var details = tweet.retweeted_status || tweet;
                
                return prev + templates.tweet({
                    _t      : templates,
                    tweet   : tweet,
                    details : details,
                    date    : self._tweetDate(now, tweet),
                    html    : text.autoLinkWithJSON(
                                _nl2br(details.text),
                                details.entities,
                                _options
                    )
                });
            }, "");
        },
        
        _tweetDate : function(now, tweet) {
            var time = moment(tweet.created_at),
                diff = now.diff(time, "hours");
        
            // TODO: .fromNow is a little over-eager about showing "1 day", should figure out why
            return (diff > 24) ? time.format("DD MMM") : time.fromNow(true);
        }
    });
    
    Y.namespace("Falco.Views").Timeline = Timeline;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Extensions
        "extension-timeline-menus",
        "extension-tweet-actions",
        
        // Templates
        "template-timeline",
        "template-tweet",
        "template-tweet-name",
        
        // CSS
        "css-timeline",
        "css-tweet",
        "css-icons"
    ]
});
