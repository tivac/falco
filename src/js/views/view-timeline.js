YUI.add("view-timeline", function(Y) {
    "use strict";
    
    var moment     = require("moment"),
        text       = require("twitter-text"),
        
        falco      = Y.namespace("Falco"),
        extensions = Y.namespace("Falco.Extensions"),
        templates  = Y.namespace("Falco.Templates"),
        
        options, Timeline;
    
    options = {
        "data-external" : ""
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
                        timeline, {
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
            var self = this,
                ol,
                now,
                models,
                updates;
            
            if(!this.rendered) {
                return this.render();
            }
            
            models  = e.models || e.parsed || [ e.model ];
            updates = models.length;
            
            ol = this.get("container").one("ol");
            ol.prepend(
                this._renderTweets(models)
            );
            
            if(updates === this.get("model").get("tweets").size()) {
                return;
            }
            
            now = moment();
            
            // Update timestamps for all other tweets
            this.get("model").get("tweets").each(function(tweet, idx) {
                // skip the models we just rendered
                if(idx < updates) {
                    return;
                }
                
                ol.one("[data-id='" + tweet.id_str + "'] .time").setHTML(self._tweetDate(now, tweet));
            });
        },
        
        _renderTweets : function(tweets) {
            var self = this,
                now  = moment();
            
            return tweets.reduce(function(prev, tweet) {
                tweet.html = text.autoLinkWithJSON(tweet.text, tweet.entities, options);
                tweet.date = self._tweetDate(now, tweet);
                
                return prev + templates.tweet(tweet);
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
        
        // CSS
        "css-timeline",
        "css-tweet",
        "css-icons"
    ]
});
