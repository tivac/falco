"use strict";

var twemoji = require("twemoji");

exports.parse = function(text) {
    return twemoji.parse(
        text,
        function(icon) {
            return "../node_modules/twemoji/svg/" + icon + ".svg";
        }
    );
};

exports.replace = function(text) {
    return twemoji.replace(text, function(match, icon, variant) {
        // Most of this function is straight out of twemoji because they don't expose it :(
        if(variant === "\uFE0E") {
            return match;
        }
        
        icon = twemoji.convert.toCodePoint(
            // if variant is present as \uFE0F
            variant === "\uFE0F" ?
                // the icon should not contain it
                icon.slice(0, -1) :
                // fix non standard OSX behavior
                (icon.length === 3 && icon.charAt(1) === "\uFE0F" ?
                  icon.charAt(0) + icon.charAt(2) : icon)
        );
        
        return "../node_modules/twemoji/svg/" + icon + ".svg"
    })
}
