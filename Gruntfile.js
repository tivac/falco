/*jshint node:true */
"use strict";

module.exports = function(grunt) {
    
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-mkdir");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-bumpup");
    grunt.loadNpmTasks("grunt-curl");
    
    grunt.loadTasks("./build/");
    
    grunt.initConfig({
        pkg : grunt.file.readJSON("./package.json"),
        
        nodewebkit : {
            name : "node-webkit-v<%= pkg.nodewebkit.version %>-win-ia32"
        },
        
        bumpup : "package.json",
        
        compress : {
            falco : {
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
                    archive : "./bin/falco.nw"
                }
            },
            
            release : {
                files : [
                    {
                        expand: true,
                        src : "./falco.exe",
                        cwd : "./bin"
                    }, {
                        expand  : true,
                        flatten : true,
                        src     : [ "**/*.dll", "**/*.pak" ],
                        cwd     : "./bin/<%= nodewebkit.name %>"
                    }
                ],
                
                options : {
                    mode    : "zip",
                    level   : 7,
                    archive : "./bin/falco-v<%= pkg.version %>.zip"
                }
            }
        },
        
        curl : {
            nw : {
                src  : "https://s3.amazonaws.com/node-webkit/v<%= pkg.nodewebkit.version %>/<%= nodewebkit.name %>.zip",
                dest : "./bin/<%= nodewebkit.name %>.zip"
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
            
            modules : {
                files : [ "src/js/**", "!src/js/_config*", "!src/js/debug.js" ],
                tasks : "yui"
            }
        },
        
        unzip : {
            nw : {
                src  : "<%= curl.nw.dest %>",
                dest : "./bin/<%= nodewebkit.name %>/"
            }
        }
    });
    
    // Task for updating the pkg config property. Needs to be run after
    // bumpup so the next tasks in queue can work with updated values.
    grunt.registerTask(
        "update:package",
        "Re-read package.json from disk to pick up changes from bumpup",
        function () {
            grunt.config.set("pkg", grunt.file.readJSON("package.json"));
        }
    );
    
    grunt.registerTask(
        "default",
        "Run local version of the app",
        "shell:launch"
    );
    
    grunt.registerTask(
        "debug",
        "Run local version of the app with developer tools open",
        [ "yui", "template", "shell:debug" ]
    );
    
    grunt.registerTask(
        "release",
        "Build a release executable & tag the current revision",
        function(type) {
            type || (type = "patch");
            
            grunt.task.run(
                "bumpup:" + type,
                "update:package",
                "yui",
                "template",
                "mkdir",
                "compress:falco",
                "package",
                "compress:release"
            );
        }
    );
    
    grunt.registerTask(
        "deploy",
        "Push the current release & tags",
        [ "tag:version", "tag:push" ]
    );
    
    grunt.registerTask(
        "node-webkit",
        "Fetch & extract the version of node-webkit specified in package.json",
        [ "curl:nw", "unzip:nw" ]
    );
};
