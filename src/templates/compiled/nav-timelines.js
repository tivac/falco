YUI.add("template-nav-timelines", function(Y) {
    "use strict";
    Y.namespace("Tristis.Templates")["nav-timelines"] = Y.Template.Micro.revive(function (Y, $e, data) {
var $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='';
 Y.Array.each(this.timelines, function(timeline) { 
$t+='\r\n<li class="timeline '+
$e($v( timeline.slug ))+
'">\r\n    ';
 if(timeline.type === "home") { 
$t+='\r\n    <a href="/">\r\n    ';
 } else if(timeline.type === "mentions") { 
$t+='\r\n    <a href="/mentions">\r\n    ';
 } else { 
$t+='\r\n    <a href="/lists/'+
$e($v( timeline.id_str ))+
'">\r\n    ';
 } 
$t+='\r\n        '+
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
