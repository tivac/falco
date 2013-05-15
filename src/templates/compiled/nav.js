YUI.add("template-nav", function(Y) {
    "use strict";
    Y.namespace("Tristis.Templates")["nav"] = Y.Template.Micro.revive(function (Y, $e, data) {
var $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='<div class="user">\r\n    <a href="https://twitter.com/'+
$e($v( data.user.screen_name ))+
'" data-external>\r\n        <img class="icon" src="'+
$e($v( data.user.profile_image_url ))+
'">\r\n    </a>\r\n</div>\r\n<ol class="timelines">\r\n    '+
$v( data._t.timelines(data) )+
'\r\n</ol>\r\n';
return $t;
});
}, "@VERSION@", {
    requires : [
        "template"
    ]
});
