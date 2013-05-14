YUI.add("template-timeline", function(Y) {
    "use strict";
    Y.namespace("Tristis.Templates")["timeline"] = Y.Template.Micro.revive(function (Y, $e, data) {
var $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='';
 if(this.name) { 
$t+='\r\n<h2>'+
$e($v( this.name ))+
' <small>'+
$e($v( this.full_name ))+
'</small></h2>\r\n';
 } 
$t+='\r\n<ol>\r\n    ';
 this.tweets.forEach(function(tweet) { 
$t+='\r\n    <li>'+
$v( this._t.tweet.apply(tweet) )+
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
