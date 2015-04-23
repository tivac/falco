"use strict";

var m = require("mithril"),
    
    components = require("../components");

module.exports = {
    view : function() {
        return m(".content",
            m.component(components.menu),
            m.component(components.list)
        );
    }
};
