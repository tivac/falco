YUI.add("template-nav-lists", function(Y) {
    "use strict";
    Y.namespace("Tristis.Templates")["nav-lists"] = Y.Template.Micro.revive(function (Y, $e, data) {
var $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='';
 Y.Array.each(this.lists, function(list) { 
$t+='\r\n<li class="list '+
$e($v( list.slug ))+
'">\r\n    <a href="/lists/'+
$e($v( list.id_str ))+
'">\r\n        '+
$e($v( list.name ))+
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
