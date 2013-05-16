YUI.add("view-timeline", function(Y) {
    "use strict";
    
    var moment    = require("moment"),
    
        tristis   = Y.namespace("Tristis"),
        templates = Y.namespace("Tristis.Templates"),
        
        options, Timeline;
    
    options = {
        "data-external" : ""
    };
    
    moment.lang("en", {
        relativeTime : {
            // our custom values
            s  : "s",
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
    
    Timeline = Y.Base.create("timeline", Y.View, [], {
        template : templates.timeline,
        
        initializer : function() {
            var model = this.get("model");
            
            this._handles = [
                model.after("reset", this.render, this),
                model.get("tweets").after([ "reset", "add" ], this._renderUpdate, this)
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
            var models;
            
            if(!this.rendered) {
                return this.render();
            }
            
            models = e.models ? e.models : [ e.model ];
            
            this.get("container").one("ol").prepend(
                this._renderTweets(models)
            );
        },
        
        _renderTweets : function(tweets) {
            var now = moment();
            
            return tweets.reduce(function(prev, tweet) {
                var time = moment(tweet.created_at),
                    diff = now.diff(time, "hours");
            
                tweet.html = tristis.txt.autoLinkWithJSON(tweet.text, tweet.entities, options);
                
                // TODO: .fromNow is a little over-eager about showing "1 day", should figure out why
                tweet.date = diff > 24 ? time.format("DD MMM") : time.fromNow(true);
                
                return prev + templates.tweet(tweet);
            }, "");
        }
    });
    
    Y.namespace("Tristis.Views").Timeline = Timeline;
    
}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Templates
        "template-timeline",
        "template-tweet"
    ]
});
