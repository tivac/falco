/* exported tristis_config */
var tristis_config = {
    base: "../node_modules/yui/",
    groups : {
        $group : {
            base : "{dir}"
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
