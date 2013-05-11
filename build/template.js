/*jshint node:true */
"use strict";

module.exports = function(grunt) {
    
    var path   = require("path"),
        Micro  = require("yui/template-micro").Template.Micro,
        module = Micro.compile(grunt.file.read("build/template.ejs"));
    
    grunt.registerTask("template", "Precompile templates", function() {
        var files = grunt.file.expand({ filter : "isFile" }, [ "src/templates/*.ejs", "src/templates/**/*.ejs" ]);
        
        files.forEach(function(file) {
            var name = path.basename(file, path.extname(file)),
                tmpl = grunt.file.read(file),
                fn   = Micro.precompile(tmpl);
            
            fn = module({
                module   : "template-" + name,
                template : name,
                fn       : fn
            });
            
            grunt.file.write(file.replace("src/templates/", "src/templates/compiled/").replace(".ejs", ".js"), fn);
        });
    });
};
