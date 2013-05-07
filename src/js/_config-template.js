/* exported tristis_config */
var tristis_config = {
    base   : "../node_modules/yui/",
    filter : "raw",
    groups : {
        $group : {
            base : "js{dir}"
        },
        
        "template": {
            patterns : {
                "template-" : {
                    configFn : function(me) {
                        "use strict";
                        
                        me.fullpath = "templates/compiled/" + me.name.replace(me.group + "-", "") + ".micro";
                        me.requires = [ "template" ];
                    }
                }
            }
        }
    }
};
