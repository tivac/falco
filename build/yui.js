/*jshint node:true */
"use strict";

module.exports = function(grunt) {
    
    grunt.registerTask("yui", "Build YUI config information", function() {
        var Configger = require("yui-configger"),
            configger;
        
        configger = new Configger({
            root   : "./src/js/",
            quiet  : !grunt.option("verbose")
        });
        
        grunt.file.write("./src/js/_config.js", configger.run());
    });
};
