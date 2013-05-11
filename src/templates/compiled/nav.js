YUI.add("template-nav", function(Y) {
    "use strict";
    Y.namespace("Tristis.Templates")["nav"] = Y.Template.Micro.revive(function (Y, $e, data) {
var $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='<ol>\r\n    <li class="user">\r\n        <a href="https://twitter.com/'+
$e($v( this.user.screen_name ))+
'" data-external>\r\n            <img class="icon" src="'+
$e($v( this.user.profile_image_url ))+
'">\r\n        </a>\r\n    </li>\r\n    <li class="timeline">\r\n        <a href="/">TIMELINE</a>\r\n    </li>\r\n</ol>\r\n<ol class="lists"></ol>\r\n';
return $t;
});
}, "@VERSION@", {
    requires : [
        "template"
    ]
});
