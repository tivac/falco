/*jshint node:true */
"use strict";

var fs    = require("fs"),
    path  = require("path"),
    async = require("async");

module.exports = function(config, done) {
    async.waterfall([
        function readNodeWebkit(callback) {
            fs.readFile(
                path.join(config.nw.dir, "nw.exe"),
                function(err, data) {
                    if(err) {
                        return callback(err);
                    }
                
                    callback(null, data);
                }
            );
        },
        
        function readTristis(nw, callback) {
            fs.readFile("./dist/" + config.app + ".nw", function(err, data) {
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
};
