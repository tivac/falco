/*jshint node:true */
"use strict";

var fs       = require("fs"),
    path     = require("path"),
    shell    = require("shelljs"),
    archiver = require("archiver"),
    
    platforms;

module.exports = function(config, done) {
    var zip    = archiver("zip", { level : 9 }),
        dest   = fs.createWriteStream("./dist/" + config.app + ".zip"),
        filter = platforms[config.platform];
        
    dest.on("close", done);
    zip.on("error", done);
    
    zip.pipe(dest);
    
    zip.append(
        fs.createReadStream(path.join("./dist", config.app + ".exe")),
        { name : config.app + ".exe" }
    );
    
    shell.ls("-R", "./temp/nw/")
        .filter(function(file) {
            var ext = path.extname(file);
            
            return filter(ext);
        })
        .forEach(function(file) {
            zip.append(
                fs.createReadStream(path.join("./temp/nw", file)),
                { name : file }
            );
        });
    
    zip.finalize(function(err, bytes) {
        if (err) {
            return done(err);
        }
        
        config.log("Wrote " + bytes + " bytes");
    });
};

platforms = {
    win : function(ext) {
        return ext === ".dll" || ext === ".pak";
    }
};
