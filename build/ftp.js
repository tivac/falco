/*jshint node:true */
"use strict";

module.exports = function(grunt) {
    
    var fs   = require("fs"),
        Ftp  = require("jsftp"),
        conf = require("config").Ftp;
    
    grunt.registerTask("ftp", "Copy the current version zip to a FTP server", function() {
        var done = this.async(),
            ftp  = new Ftp(conf),
            file = "tristis-v" + grunt.config.get("pkg").version + ".zip",
            release;
        
        release = fs.createReadStream("./bin/" + file);
        release.pause();
        
        ftp.getPutSocket(conf.dir + file, function(err, socket) {
            if (err) {
                grunt.log.error(err);
                
                return done(false);
            }
            
            release.on("end", function() {
                release.destroy();
                
                done();
            });
            
            release.pipe(socket); // Transfer from source to the remote file
            
            grunt.log.writeln("Streaming ./bin/" + file + " to " + conf.dir + file);
            
            release.resume();
        });
    });
};
