/*exported tristis_config */
var tristis_config = {
        base: "../node_modules/yui/",
        groups: {
            "/": {
                base: "js/",
                modules: {
                    "app-tristis": {
                        path: "app-tristis.js",
                        requires: [
                            "base-build",
                            "app",
                            "extension-tristis-events",
                            "extension-tristis-routes"
                        ]
                    },
                    "extension-tristis-events": {
                        path: "extension-tristis-events.js",
                        requires: []
                    },
                    "extension-tristis-routes": {
                        path: "extension-tristis-routes.js",
                        requires: []
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
