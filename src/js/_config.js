var tristis_config = {
        base: "../node_modules/yui/",
        filter: "raw",
        groups: {
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
            "/": {
                base: "js/",
                modules: {
                    "app-tristis": {
                        path: "app-tristis.js",
                        requires: [
                            "base-build",
                            "app",
                            "extension-view-classes",
                            "extension-view-parent",
                            "extension-tristis-events",
                            "extension-tristis-routes",
                            "model-user",
                            "model-list-timelines",
                            "view-nav"
                        ]
                    },
                    "extension-tristis-events": {
                        path: "extension-tristis-events.js",
                        requires: []
                    },
                    "extension-tristis-routes": {
                        path: "extension-tristis-routes.js",
                        requires: ["gallery-lazy-load"]
                    },
                    "model-list-timelines": {
                        path: "model-list-timelines.js",
                        requires: [
                            "base-build",
                            "model-list",
                            "model-timeline-home",
                            "model-timeline-mentions",
                            "model-timeline-list"
                        ]
                    },
                    "model-list-tweets": {
                        path: "model-list-tweets.js",
                        requires: [
                            "base-build",
                            "lazy-model-list",
                            "extension-model-list-more"
                        ]
                    },
                    "model-timeline-base": {
                        path: "model-timeline-base.js",
                        requires: [
                            "base-build",
                            "model",
                            "model-list-tweets"
                        ]
                    },
                    "model-timeline-home": {
                        path: "model-timeline-home.js",
                        requires: [
                            "base-build",
                            "model-timeline-base"
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
                    "model-user": {
                        path: "model-user.js",
                        requires: [
                            "base-build",
                            "model"
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
                            "template-nav-lists"
                        ]
                    },
                    "view-timeline": {
                        path: "view-timeline.js",
                        requires: [
                            "base-build",
                            "view",
                            "template-timeline",
                            "template-tweet"
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
                    }
                }
            },
            "/gallery/": {
                base: "js/gallery/",
                modules: {
                    "gallery-debounce": { path: "gallery-debounce.js" },
                    "gallery-lazy-load": {
                        path: "gallery-lazy-load.js",
                        requires: ["oop"]
                    }
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