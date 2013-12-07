/*jshint node:true */
"use strict";

var fs    = require("fs"),
    path  = require("path"),
    exec  = require("child_process").exec,
    shell = require("shelljs"),
    
    platforms = {};

module.exports = function(config, done) {
    platforms[config.platform](config, done);
};

platforms = {
    win : function(config, done) {
        var temp = "./temp/nw",
            files;
        
        if(!fs.existsSync("./bin/upx.exe")) {
            return done("You need to go get upx from http://upx.sourceforge.net/ & place it in ./bin");
        }
        
        files = shell.ls("-R", temp)
                    .filter(function(file) {
                        var ext = path.extname(file);
                        
                        return ext === ".exe" || ext === ".dll";
                    })
                    .map(function(file) {
                        return path.relative("./bin", path.join(temp, file));
                    });
        
        config.log("Beginning compression of executables, this may take a while...");
        
        exec("upx.exe -4 " + files.join(" "), { cwd : "./bin" }, function(err, stdout) {
            if(err) {
                return done(err);
            }
            
            config.log("verbose", stdout);
            
            done();
        });
    }
};
