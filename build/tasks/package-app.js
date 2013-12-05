/*jshint node:true */
"use strict";

module.exports = function(config, done) {
    if(!config.dullard.tasks["package-app-" + config.platform]) {
        return done("No package-app-" + config.platform + " task has been defined, please write one");
    }
    
    config.dullard.run("package-app-" + config.platform, done);
};
