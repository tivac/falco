YUI.add("template-nav-timelines", function(Y) {
    "use strict";
    Y.namespace("Tristis.Templates")["nav-timelines"] = Y.Template.Micro.revive(function (Y, $e, data) {
var $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='';
 data.timelines.forEach(function(timeline) { 
$t+='\r\n<li class="timeline '+
$e($v( timeline.slug ))+
'';
 if(timeline.url === data.path) { 
$t+=' active';
 } 
$t+='"\r\n    data-id="'+
$e($v( timeline.id_str || timeline.id ))+
'"\r\n>\r\n    <a href="'+
$e($v( timeline.url ))+
'">\r\n        '+
$e($v( timeline.name ))+
'\r\n    </a>\r\n</li>\r\n';
 }); 
$t+='\r\n';
return $t;
});
}, "@VERSION@", {
    requires : [
        "template"
    ]
});
