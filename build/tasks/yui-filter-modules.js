/*jshint node:true */

"use strict";

var fs    = require("fs"),
    path  = require("path"),
    shell = require("shelljs"),
    Y     = require("yui/loader"),
    falco = require("../../src/js/_config.js");

module.exports = function(config) {
    var require = [],
        loader, results, group;
    
    loader = new Y.Loader(falco);
    
    // Make sure to require every module we've defined
    for(group in falco.groups) {
        // Ignore pattern groups
        if(group.indexOf("/") === -1) {
            continue;
        }
        
        require.push.apply(require, Object.keys(falco.groups[group].modules));
    }
    
    loader.require(require);
    
    results = loader.resolve(true);
    
    results.js
        .filter(function(file) {
            return file.indexOf("node_modules/yui") > -1;
        })
        .forEach(function(file) {
            var full = path.join(process.cwd(), "src", file);
            
            shell.mkdir("-p", path.join("./temp", "src", path.dirname(file)));
            
            shell.cp(full, path.join("./temp", "src", file));
        });
};
