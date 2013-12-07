/*jshint node:true */
"use strict";

var fs    = require("fs"),
    async = require("async"),
    
    platforms;

module.exports = function(config, done) {
    platforms[config.platform](config, done);
};

platforms = {
    win : function(config, done) {
        async.waterfall([
            function readNodeWebkit(callback) {
                fs.readFile(
                    "./temp/nw/nw.exe",
                    function(err, data) {
                        if(err) {
                            return callback(err);
                        }
                    
                        callback(null, data);
                    }
                );
            },
            
            function readTristis(nw, callback) {
                fs.readFile("./temp/" + config.app + ".nw", function(err, data) {
                    if(err) {
                        return callback(err);
                    }
                    
                    callback(null, nw, data);
                });
            },
            
            function combine(nw, falco, callback) {
                callback(null, Buffer.concat([ nw, falco ]));
            },
            
            function write(falco, callback) {
                fs.writeFile("./dist/" + config.app + ".exe", falco, function(err) {
                    callback(err);
                });
            }
        ], done);
    }
};
