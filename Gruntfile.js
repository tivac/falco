/*jshint node:true */
"use strict";

module.exports = function(grunt) {
    
    var nwDir = grunt.option("nwdir") || "./bin/node-webkit-v0.5.1-win-ia32/";
    
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-mkdir");
    grunt.loadNpmTasks("grunt-shell");
    
    grunt.loadTasks("./build/");
    
    grunt.initConfig({
        mkdir : {
            bin : {
                options : {
                    create : [ "bin" ]
                }
            }
        },
        
        compress : {
            tristis : {
                src  : [ "src/*", "package.json" ],
                options : {
                    mode    : "zip",
                    archive : "./bin/tristis.nw"
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
    
    grunt.registerTask("default",     [ "shell:launch" ]);
    grunt.registerTask("debug",       [ "shell:debug" ]);
    grunt.registerTask("release",     [ "mkdir", "compress", "package" ]);
};
