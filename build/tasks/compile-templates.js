/*jshint node:true */
"use strict";

var fs       = require("fs"),
    path     = require("path"),
    shell    = require("shelljs"),
    Micro    = require("yui/template-micro").Template.Micro,
    template = Micro.compile(fs.readFileSync("./build/template.ejs", "utf8"));

module.exports = function(config) {
    var files = shell.ls("-R", "./src/templates/*.ejs");
    
    files.forEach(function(file) {
        var name, tmpl, fn;
        
        config.log("verbose", "Parsing " + file);
        
        name = path.basename(file, path.extname(file));
        tmpl = fs.readFileSync(file, "utf8");
        
        fn = template({
            module   : "template-" + name,
            template : name,
            fn       : Micro.precompile(tmpl)
        });
        
        file = file.replace("src/templates/", "src/templates/compiled/")
                   .replace(".ejs", ".js");
        
        fs.writeFileSync(file, fn);
        
        config.log("verbose", "Wrote " + file);
    }.bind(this));
};
