YUI.add("template-tweet", function(Y) {
    "use strict";
    Y.namespace("Tristis.Templates")["tweet"] = Y.Template.Micro.revive(function (Y, $e, data) {
var $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='<div class="tweet" data-id="'+
$e($v( this.id_str ))+
'">\r\n    <img class="icon" src="'+
$e($v( this.user.profile_image_url ))+
'" >\r\n    \r\n    <div class="bd">\r\n        <p class="name">\r\n            '+
$e($v( this.user.name ))+
'\r\n            <span class="screen-name">@'+
$e($v( this.user.screen_name ))+
'</span>\r\n        </p>\r\n        <p class="text">\r\n            '+
$v( this.text )+
'\r\n        </p>\r\n        <div class="meta">\r\n            <p class="">\r\n        </div>\r\n    </div>\r\n    \r\n    <div class="time">\r\n        <p>\r\n            '+
$e($v( this.created_at ))+
'\r\n        </p>\r\n    </div>\r\n</div>\r\n';
return $t;
});
}, "@VERSION@", {
    requires : [
        "template"
    ]
});
