/*jshint node:true*/
"use strict";

var fs        = require("fs"),
    Configger = require("yui-configger");

module.exports = function()  {
    var configger = new Configger({
        root   : "./src/js/"
    });
    
    fs.writeFileSync("./src/js/_config.js", configger.run());
};
