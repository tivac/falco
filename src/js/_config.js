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
                            "extension-tristis-events",
                            "extension-tristis-routes",
                            "extension-view-classes",
                            "extension-view-parent",
                            "view-nav",
                            "model-user"
                        ]
                    },
                    "extension-tristis-events": {
                        path: "extension-tristis-events.js",
                        requires: []
                    },
                    "extension-tristis-routes": {
                        path: "extension-tristis-routes.js",
                        requires: []
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
                    "model-user": {
                        path : "model-user.js",
                        requires : [
                            // YUI
                            "base-build",
                            "model"
                        ]
                    },
                    "view-nav": {
                        path: "view-nav.js",
                        requires: [
                            "base-build",
                            "view",
                            "template-nav"
                        ]
                    }
                }
            },
            "/oauth/": {
                base: "js/oauth/",
                modules: {
                    "auth": {
                        path: "auth.js",
                        requires: ["node"]
                    }
                }
            }
        }
    };
