var tristis_config = {
        base: "../node_modules/yui/",
        filter: "raw",
        groups: {
            "template": {
                patterns: {
                    "template-": {
                        configFn: function (me) {
                            "use strict";
                            me.fullpath = "templates/compiled/" + me.name.replace(me.group + "-", "") + ".micro";
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
                            "model-list-lists",
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
                    "model-list-lists": {
                        path: "model-list-lists.js",
                        requires: [
                            "base-build",
                            "lazy-model-list"
                        ]
                    },
                    "model-list-timeline": {
                        path: "model-list-timeline.js",
                        requires: [
                            "base-build",
                            "lazy-model-list"
                        ]
                    },
                    "model-user": {
                        path: "model-user.js",
                        requires: [
                            "base-build",
                            "model"
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
            "/gallery/": {
                base: "js/gallery/",
                modules: {
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