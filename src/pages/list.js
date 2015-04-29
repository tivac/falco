"use strict";

var m = require("mithril"),
    
    components = require("../components"),
    state      = require("../lib/state");

module.exports = {
    controller : function() {
        var ctrl = this;
        
        state.selectList(m.route.param("list"));
        
        // force a re-render once a minute to update timestamps
        ctrl.interval = setInterval(m.redraw, 60000);
        
        // Clear that same interval when the controller unloads
        ctrl.onunload = function() {
            clearInterval(ctrl.interval);
        };
    },
    
    view : function() {
        return m(".content",
            m.component(components.menu),
            m.component(components.list)
        );
    }
};
