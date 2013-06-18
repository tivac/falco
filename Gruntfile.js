/*jshint node:true */
"use strict";

module.exports = function(grunt) {
    
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-mkdir");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-bumpup");
    grunt.loadNpmTasks("grunt-curl");
    //grunt.loadNpmTasks("grunt-zip");
    
    grunt.loadTasks("./build/");
    
    grunt.initConfig({
        pkg : grunt.file.readJSON("./package.json"),
        
        bumpup : "package.json",
        
        compress : {
            tristis : {
                src : [
                    "package.json",
                    "config/**",
                    "src/**",
                    "node_modules/**",
                    // Filter dev node_modules
                    "!node_modules/grunt*/**",
                    "!node_modules/yui-configger/**",
                    "!node_modules/jsftp/**",
                    // Filter un-used yui code
                    "!node_modules/yui/**/*.swf",
                    "!node_modules/yui/**/*-coverage.js",
                    "!node_modules/yui/**/*-debug.js",
                    "!node_modules/yui/**/*-min.js"
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
                        cwd     : "./bin/<% pkg.nodewebkit.dir %>"
                    }
                ],
                
                options : {
                    mode    : "zip",
                    level   : 7,
                    archive : "./bin/tristis-v<% pkg.version %>.zip"
                }
            }
        },
        
        curl : {
            nw : {
                src  : "https://s3.amazonaws.com/node-webkit/v<%= pkg.nodewebkit.version %>/node-webkit-v<%= pkg.nodewebkit.version %>-win-ia32.zip",
                dest : "./bin/node-webkit-v<%= pkg.nodewebkit.version %>-win-ia32.zip"
            }
        },
        
        mkdir : {
            bin : {
                options : {
                    create : [ "bin" ]
                }
            }
        },
        
        shell : {
            launch : {
                command : "nw.exe ../../",
                options : {
                    execOptions : {
                        cwd : "<%= unzip.nw.dest %>"
                    }
                }
            },
            
            debug : {
                command : "nw.exe ../../ --debug",
                options : {
                    execOptions : {
                        cwd : "<%= unzip.nw.dest %>"
                    }
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
        
        unzip : {
            nw : {
                src  : "<%= curl.nw.dest %>",
                dest : "./bin/"
            }
        }
    });
    
    // Task for updating the pkg config property. Needs to be run after
    // bumpup so the next tasks in queue can work with updated values.
    grunt.registerTask("update:package", function () {
        grunt.config.set("pkg", grunt.file.readJSON("package.json"));
    });
    
    grunt.registerTask("default", [ "shell:launch" ]);
    grunt.registerTask("debug",   [ "shell:debug" ]);
    
    grunt.registerTask("release", "", function(type) {
        type || (type = "patch");
        
        grunt.task.run(
            "bumpup:" + type,
            "update:package",
            // yui,
            "template",
            "mkdir",
            "tag:version",
            "compress:tristis",
            "package",
            "compress:release"
        );
    });
    
    grunt.registerTask("deploy", [ "ftp", "tag:push" ]);
    
    grunt.registerTask("node-webkit", [ "curl:nw", "unzip:nw" ]);
};
