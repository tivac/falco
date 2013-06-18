/*jshint node:true */
"use strict";

var fs = require("fs"),
    
    unzip    = require("unzip"),
    Progress = require("progress");;

module.exports = function(grunt) {
    
    // NodeJS powered binary concatenation, a bit longer than "copy /BY" but cross-platform :D
    grunt.registerMultiTask(
        "unzip",
        "Unzip a file somewhere",
        function() {
            var config = this.data,
                done, stream, bar;
            
            if(!config.src || !config.dest) {
                grunt.log.error("Missing src or dest");
                
                return false;
            }
            
            config = {
                src  : grunt.template.process(config.src),
                dest : grunt.template.process(config.dest)
            };
            
            grunt.log.writeln("Unzipping " + config.src + " to " + config.dest);
            bar = new Progress("[:bar] :percent", {
                incomplete : " ",
                width      : "50",
                total      : fs.statSync(config.src).size
            });
            
            done = this.async();
            
            stream = fs.createReadStream(grunt.template.process(config.src));
            stream.pause();
            
            stream.pipe(unzip.Extract({
                path : grunt.template.process(config.dest)
            }));
            
            stream.on("data", function(data) {
                bar.tick(data.length);
            });
            
            stream.on("close", function() {
                done();
            });
            
            stream.on("error", function(error) {
                grunt.log.error("Unzip error");
                grunt.log.error(error);
                
                done(false);
            });
            
            stream.resume();
        }
    );
    
};
