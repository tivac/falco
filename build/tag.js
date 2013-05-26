/*jshint node:true */
"use strict";

module.exports = function(grunt) {
    
    var exec = require("child_process").exec;
    
    grunt.registerTask("tag", "Add the current version as a git tag", function() {
        var done = this.async();
        
        exec("git tag v" + grunt.config.get("pkg").version, { cwd : process.cwd() }, function(err) {
            done(!err);
        });
    });
};
