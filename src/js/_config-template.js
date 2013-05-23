/* exported tristis_config */
var tristis_config = {
    base   : "../node_modules/yui/",
    filter : "raw",
    groups : {
        $group : {
            base : "js{dir}"
        },
        
        "template" : {
            patterns : {
                "template-" : {
                    configFn : function(me) {
                        "use strict";
                        
                        me.fullpath = "templates/compiled/" + me.name.replace(me.group + "-", "") + ".js";
                        me.requires = [ "template" ];
                    }
                }
            }
        },
        
        "css" : {
            base : "css/",
            patterns : {
                "css-" : {
                    configFn : function(me) {
                        "use strict";
                        
                        me.path = me.name.replace("css-", "") + ".css";
                        me.type = "css";
                    }
                }
            }
        }
    }
};
