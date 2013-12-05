/*jshint node:true */

"use strict";

var fs       = require("fs"),
    path     = require("path"),
    shell    = require("shelljs"),
    archiver = require("archiver");

module.exports = function(config, done) {
    var zip  = archiver("zip", { zlib : { level : 0 }}),
        dest = fs.createWriteStream("./bin/falco-v" + config.package.version + ".nw");
        
    zip.on("close", function() {
        console.log(arguments);
        
        done();
    });
    
    zip.on("error", function(err) {
        console.log(err);
        
        done(err);
    });
    
    zip.pipe(dest);
    
    shell.ls("-R", "./temp")
        .filter(function(item) {
            return fs.statSync(item).isFile();
        })
        .forEach(function(file) {
            console.log(file);
            
            zip.append(fs.createReadStream(file), { name : file });
        });
    
    zip.finalize(function(err, bytes) {
        if (err) {
            return done(err);
        }

        console.log(bytes + " total bytes");
    });
};
