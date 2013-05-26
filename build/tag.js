/*jshint node:true */
"use strict";

module.exports = function(grunt) {
    
    var exec = require("child_process").exec;
    
    grunt.registerTask("tag:version", "Add the current version as a git tag", function() {
        var done = this.async();
        
        exec("git tag v" + grunt.config.get("pkg").version, { cwd : process.cwd() }, function(err) {
            if(err) {
                grunt.log.error(err);
            }
            
            done(!err);
        });
    });
    
    grunt.registerTask("tag:push", "Push tags to github", function() {
        var done = this.async();
        
        exec("git push --tags", { cwd : process.cwd() }, function(err) {
            if(err) {
                grunt.log.error(err);
            }
            
            done(!err);
        });
    });
};
