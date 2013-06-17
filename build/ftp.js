/*jshint node:true */
"use strict";

module.exports = function(grunt) {
    
    var fs       = require("fs"),
        Ftp      = require("jsftp"),
        conf     = require("config").Deploy,
        Progress = require("progress");
    
    grunt.registerTask("ftp", "Copy the current version zip to a FTP server", function() {
        var done = this.async(),
            ftp  = new Ftp(conf),
            file = "tristis-v" + grunt.config.get("pkg").version + ".zip",
            path = "./bin/" + file,
            bar, release;
        
        release = fs.createReadStream(path);
        release.pause();
        
        grunt.log.writeln("Uploading ./bin/" + file + " to " + conf.dir + file);
        bar = new Progress("[:bar] :percent", {
            incomplete : " ",
            width      : "50",
            total      : fs.statSync(path).size
        });
        
        ftp.getPutSocket(conf.dir + file, function(err, socket) {
            var written = 0;
            
            if (err) {
                grunt.log.error(err);
                
                return done(false);
            }
            
            release.on("end", function() {
                release.destroy();
                
                done();
            });
            
            release.pipe(socket); // Transfer from source to the remote file
            
            
            
            release.resume();
            
            socket.on("drain", function() {
                bar.tick(socket.bytesWritten - written);
                
                written = socket.bytesWritten;
            });
        });
    });
};
