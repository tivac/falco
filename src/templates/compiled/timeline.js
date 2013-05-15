YUI.add("template-timeline", function(Y) {
    "use strict";
    Y.namespace("Tristis.Templates")["timeline"] = Y.Template.Micro.revive(function (Y, $e, data) {
var $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='';
 if(data.name) { 
$t+='\r\n<h2>'+
$e($v( data.name ))+
' <small>'+
$e($v( data.full_name ))+
'</small></h2>\r\n';
 } 
$t+='\r\n<ol>\r\n    ';
 data.tweets.forEach(function(tweet) { 
$t+='\r\n    <li>'+
$v( data._t.tweet(tweet) )+
'</li>\r\n    ';
 }); 
$t+='\r\n</ol>\r\n';
return $t;
});
}, "@VERSION@", {
    requires : [
        "template"
    ]
});
