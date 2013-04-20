/*jshint node:true */
"use strict";

var fs    = require("fs"),
    async = require("async");

module.exports = function(grunt) {
    
    var nwDir = grunt.option("nwdir") || "./bin/node-webkit-v0.5.0-win-ia32/";
    
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-mkdir");
    
    grunt.initConfig({
        mkdir : {
            build : {
                options : {
                    create : [ "build" ]
                }
            }
        },
        
        compress : {
            tristis : {
                src  : [ "src/*", "package.json" ],
                options : {
                    mode    : "zip",
                    archive : "./build/tristis.nw"
                }
            }
        },
        
        shell : {
            launch : {
                command : "nw.exe ../../",
                options : {
                    execOptions : {
                        cwd : nwDir
                    }
                }
            },
            
            debug : {
                command : "nw.exe ../../ --debug",
                options : {
                    execOptions : {
                        cwd : nwDir
                    }
                }
            }
        }
    });

    // NodeJS powered binary concatenation, a bit longer than "copy /BY" but cross-platform :D
    grunt.registerTask("package", "Build a packaged binary", function() {
        var done = this.async();
        
        grunt.task.requires("mkdir");
        grunt.task.requires("compress");
        
        grunt.log.writeln("Reading buffers");
        
        async.waterfall([
            function readNodeWebkit(callback) {
                fs.readFile(nwDir + "nw.exe", function(err, data) {
                    if(err) {
                        return callback(err);
                    }
                    
                    callback(null, data);
                });
            },
            
            function readTristis(nw, callback) {
                fs.readFile("./build/tristis.nw", function(err, data) {
                    if(err) {
                        return callback(err);
                    }
                    
                    callback(null, nw, data);
                });
            },
            
            function combine(nw, tristis, callback) {
                callback(null, Buffer.concat([ nw, tristis ]));
            },
            
            function write(tristis, callback) {
                fs.writeFile("./build/tristis.exe", tristis, function(err) {
                    callback(err);
                });
            }
        ], function(err) {
            console.error(err);
            
            done();
        });
        
    });
    
    grunt.registerTask("default", [ "shell:launch" ]);
    grunt.registerTask("debug",   [ "shell:debug" ]);
    grunt.registerTask("release", [ "mkdir", "compress", "package" ]);
};
