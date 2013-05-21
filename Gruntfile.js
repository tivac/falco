/*jshint node:true */
"use strict";

module.exports = function(grunt) {
    
    var nwdir = global.nwdir = grunt.option("nwdir") || "node-webkit-v0.5.1-win-ia32";
    
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-mkdir");
    grunt.loadNpmTasks("grunt-shell");
    
    grunt.loadTasks("./build/");
    
    grunt.initConfig({
        pkg : grunt.file.readJSON("./package.json"),
        
        mkdir : {
            bin : {
                options : {
                    create : [ "bin" ]
                }
            }
        },
        
        watch : {
            templates : {
                files : [ "src/templates/**", "!src/templates/compiled/**" ],
                tasks : "template"
            },
            
            // Disabled until I figure out some configger issues
            /*modules : {
                files : [ "src/js/**", "!src/js/_config*", "!src/js/debug.js" ],
                tasks : "yui"
            }*/
        },
        
        compress : {
            tristis : {
                src : [
                    "config/**",
                    "src/**",
                    "node_modules/**",
                    "!node_modules/grunt*/**",
                    "!node_modules/yui-configger/**",
                    "!node_modules/yui/**/*.swf",
                    "!node_modules/yui/**/*-coverage.js",
                    "!node_modules/yui/**/*-debug.js",
                    "!node_modules/yui/**/*-min.js",
                    "package.json"
                ],
                
                options : {
                    mode    : "zip",
                    level   : 0,
                    archive : "./bin/tristis.nw"
                }
            },
            
            release : {
                files : [
                    {
                        expand: true,
                        src : "./tristis.exe",
                        cwd : "./bin"
                    }, {
                        expand  : true,
                        flatten : true,
                        src     : [ "**/*.dll", "**/*.pak" ],
                        cwd     : "./bin/" + nwdir
                    }
                ],
                
                options : {
                    mode    : "zip",
                    level   : 7,
                    archive : "./bin/tristis-v<%= pkg.version %>.zip"
                }
            }
        },
        
        shell : {
            launch : {
                command : "nw.exe ../../",
                options : {
                    execOptions : {
                        cwd : "./bin/" + nwdir + "/"
                    }
                }
            },
            
            debug : {
                command : "nw.exe ../../ --debug",
                options : {
                    execOptions : {
                        cwd : "./bin/" + nwdir + "/"
                    }
                }
            }
        }
    });
    
    grunt.registerTask("default",     [ "shell:launch" ]);
    grunt.registerTask("debug",       [ "shell:debug" ]);
    grunt.registerTask("release",     [ "template", "mkdir", "compress:tristis", "package", "compress:release" ]);
};
