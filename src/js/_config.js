var tristis_config = {
        base: "../node_modules/yui/",
        filter: "raw",
        groups: {
            "external": {
                base: "js/external/",
                patterns: {
                    "external-": {
                        configFn: function (me) {
                            "use strict";
                            me.path = me.name.replace("external-", "") + ".js";
                        }
                    }
                }
            },
            "template": {
                patterns: {
                    "template-": {
                        configFn: function (me) {
                            "use strict";
                            me.fullpath = "templates/compiled/" + me.name.replace(me.group + "-", "") + ".js";
                            me.requires = ["template"];
                        }
                    }
                }
            },
            "css": {
                base: "css/",
                patterns: {
                    "css-": {
                        configFn: function (me) {
                            "use strict";
                            me.path = me.name.replace("css-", "") + ".css";
                            me.type = "css";
                        }
                    }
                }
            },
            "/": {
                base: "js/",
                modules: {
                    "app-tristis": {
                        path: "app-tristis.js",
                        requires: [
                            "base-build",
                            "app",
                            "external-lawnchair",
                            "external-lawnchair-indexed-db",
                            "extension-view-classes",
                            "extension-view-parent",
                            "extension-tristis-events",
                            "extension-tristis-routes",
                            "model-user",
                            "model-list-timelines",
                            "view-nav",
                            "css-app",
                            "css-nav",
                            "stream-user",
                            "stream-users"
                        ]
                    },
                    "extension-list-users": {
                        path: "extension-list-users.js",
                        requires: [
                            "promise",
                            "array-extras",
                            "stream-users"
                        ]
                    },
                    "extension-timeline-menus": {
                        path: "extension-timeline-menus.js",
                        requires: ["node-event-html5"]
                    },
                    "extension-tristis-events": {
                        path: "extension-tristis-events.js",
                        requires: [
                            "stream-user",
                            "model-list-friends"
                        ]
                    },
                    "extension-tristis-routes": {
                        path: "extension-tristis-routes.js",
                        requires: ["gallery-lazy-load"]
                    },
                    "extension-tweet-actions": { path: "extension-tweet-actions.js" },
                    "model-list-friends": {
                        path: "model-list-friends.js",
                        requires: [
                            "base-build",
                            "lazy-model-list"
                        ]
                    },
                    "model-list-timelines": {
                        path: "model-list-timelines.js",
                        requires: [
                            "base-build",
                            "model-list",
                            "model-timeline-home",
                            "model-timeline-mentions",
                            "model-timeline-list",
                            "model-sync-lawnchair",
                            "model-sync-twitter",
                            "extension-list-users",
                            "gallery-model-sync-multi"
                        ]
                    },
                    "model-list-tweets": {
                        path: "model-list-tweets.js",
                        requires: [
                            "base-build",
                            "lazy-model-list",
                            "extension-model-list-more",
                            "model-tweet"
                        ]
                    },
                    "model-timeline-base": {
                        path: "model-timeline-base.js",
                        requires: [
                            "base-build",
                            "model",
                            "model-list-tweets",
                            "model-sync-lawnchair",
                            "model-sync-twitter",
                            "gallery-model-sync-multi"
                        ]
                    },
                    "model-timeline-home": {
                        path: "model-timeline-home.js",
                        requires: [
                            "base-build",
                            "model-timeline-base",
                            "stream-user"
                        ]
                    },
                    "model-timeline-list": {
                        path: "model-timeline-list.js",
                        requires: [
                            "base-build",
                            "model-timeline-base"
                        ]
                    },
                    "model-timeline-mentions": {
                        path: "model-timeline-mentions.js",
                        requires: [
                            "base-build",
                            "model-timeline-base"
                        ]
                    },
                    "model-tweet": {
                        path: "model-tweet.js",
                        requires: [
                            "base-build",
                            "model"
                        ]
                    },
                    "model-user": {
                        path: "model-user.js",
                        requires: [
                            "base-build",
                            "model"
                        ]
                    },
                    "stream-base": {
                        path: "stream-base.js",
                        requires: [
                            "oop",
                            "event-custom"
                        ]
                    },
                    "stream-user": {
                        path: "stream-user.js",
                        requires: [
                            "oop",
                            "event-custom",
                            "stream-base"
                        ]
                    },
                    "stream-users": {
                        path: "stream-users.js",
                        requires: [
                            "oop",
                            "event-custom",
                            "stream-base"
                        ]
                    },
                    "view-list": {
                        path: "view-list.js",
                        requires: [
                            "base-build",
                            "view",
                            "template-timeline",
                            "template-tweet"
                        ]
                    },
                    "view-nav": {
                        path: "view-nav.js",
                        requires: [
                            "base-build",
                            "view",
                            "template-nav",
                            "template-nav-timelines"
                        ]
                    },
                    "view-timeline": {
                        path: "view-timeline.js",
                        requires: [
                            "base-build",
                            "view",
                            "extension-timeline-menus",
                            "extension-tweet-actions",
                            "template-timeline",
                            "template-tweet",
                            "css-timeline",
                            "css-tweet",
                            "css-icons"
                        ]
                    }
                }
            },
            "/extensions/": {
                base: "js/extensions/",
                modules: {
                    "extension-model-list-more": { path: "extension-model-list-more.js" },
                    "extension-view-classes": {
                        path: "extension-view-classes.js",
                        requires: ["event-custom"]
                    },
                    "extension-view-parent": {
                        path: "extension-view-parent.js",
                        requires: [
                            "view",
                            "event-custom"
                        ]
                    },
                    "model-sync-lawnchair": {
                        path: "model-sync-lawnchair.js",
                        requires: ["external-lawnchair"]
                    },
                    "model-sync-twitter": { path: "model-sync-twitter.js" }
                }
            },
            "/gallery/": {
                base: "js/gallery/",
                modules: {
                    "gallery-debounce": { path: "gallery-debounce.js" },
                    "gallery-lazy-load": {
                        path: "gallery-lazy-load.js",
                        requires: ["oop"]
                    },
                    "gallery-model-sync-multi": { path: "model-sync-multi.js" }
                }
            },
            "/oauth/": {
                base: "js/oauth/",
                modules: {
                    "model-oauth": {
                        path: "model-oauth.js",
                        requires: [
                            "base-build",
                            "model"
                        ]
                    },
                    "view-link": {
                        path: "view-link.js",
                        requires: [
                            "base-build",
                            "view",
                            "model-oauth",
                            "template-oauth-link"
                        ]
                    }
                }
            }
        }
    };