/*jshint node:true */
"use strict";

module.exports = function(grunt) {
    
    var nwDir = grunt.option("nwdir") || "./bin/node-webkit-v0.5.0-win-ia32/";
    
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-shell");
    
    grunt.initConfig({
        compress : {
            chirrup : {
                src  : [ "src/*", "package.json" ],
                options : {
                    mode    : "zip",
                    archive : "chirrup.nw"
                }
            }
        },
        
        shell : {
            launch : {
                command : "nw.exe ../../chirrup.nw",
                options : {
                    execOptions : {
                        cwd : nwDir
                    }
                }
            },
            
            debug : {
                command : "nw.exe ../../chirrup.nw --debug",
                options : {
                    execOptions : {
                        cwd : nwDir
                    }
                }
            },
            
            package : {
                command : "copy /by " + nwDir + "nw.exe+chirrup.nw chirrup.exe"
            }
        }
    });
    
    grunt.registerTask("default", [ "compress", "shell:launch" ]);
    grunt.registerTask("debug",   [ "compress", "shell:debug" ]);
    grunt.registerTask("package", [ "compress", "shell:package" ]);
};
