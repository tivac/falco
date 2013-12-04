/*jshint node:true */
"use strict";

var fs    = require("fs"),
    path  = require("path"),
    async = require("async");

module.exports = function(grunt) {
    
    // NodeJS powered binary concatenation, a bit longer than "copy /BY" but cross-platform :D
    grunt.registerTask("package", "Build a packaged binary", function() {
        var done = this.async();
        
        grunt.task.requires("mkdir");
        grunt.task.requires("compress:falco");
        
        grunt.log.writeln("Reading buffers");
        
        async.waterfall([
            function readNodeWebkit(callback) {
                fs.readFile(
                    path.join(
                        grunt.config("unzip.nw.dest"),
                        "nw.exe"
                    ),
                    function(err, data) {
                        if(err) {
                            return callback(err);
                        }
                    
                        callback(null, data);
                    }
                );
            },
            
            function readTristis(nw, callback) {
                fs.readFile("./bin/falco.nw", function(err, data) {
                    if(err) {
                        return callback(err);
                    }
                    
                    callback(null, nw, data);
                });
            },
            
            function combine(nw, falco, callback) {
                callback(null, Buffer.concat([ nw, falco ]));
            },
            
            function write(falco, callback) {
                grunt.log.writeln("Writing exe");
                
                fs.writeFile("./bin/falco.exe", falco, function(err) {
                    callback(err);
                });
            }
        ], function(err) {
            if(err) {
                grunt.log.error(err);
            }
            
            done(!err);
        });
    });
};
