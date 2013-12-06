/*jshint node:true */
"use strict";

var fs    = require("fs"),
    
    shell = require("shelljs"),
    hyper = require("hyperquest"),
    unzip = require("unzip");

module.exports = function(config, done) {
    var name = config.nw.name[config.platform],
        req, zip;
    
    if(fs.existsSync(config.nw.dir + "/nw.pak")) {
        config.log("Node-webkit already downloaded");
        
        return done();
    }
    
    shell.mkdir("-p", config.nw.dir);
    
    req  = hyper(config.nw.root + name + ".zip");
    zip  = unzip.Extract({ path : config.nw.dir });
    
    config.log("Downloading " + config.nw.root + name + ".zip");
    
    req.pipe(zip);
    
    req.on("error", done);
    zip.on("error", done);
    zip.on("close", done);
};
