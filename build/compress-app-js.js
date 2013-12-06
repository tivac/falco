/*jshint node:true */
"use strict";

var fs     = require("fs"),
    path   = require("path"),
    
    async  = require("async"),
    shell  = require("shelljs"),
    uglify = require("uglify-js");

module.exports = function(config, done) {
    async.each(
        shell.find(config.temp)
            .filter(function(file) {
                return path.extname(file) === ".js";
            }),
        function(file, cb) {
            var result = uglify.minify(file);
            
            fs.writeFile(file, result.code, cb);
        },
        done
    );
};
