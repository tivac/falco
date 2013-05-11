YUI.add("template-oauth-link", function(Y) {
    "use strict";
    Y.namespace("Tristis.Templates")["oauth-link"] = Y.Template.Micro.revive(function (Y, $e, data) {
var $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='<button class="start">Authenticate with Twitter</button>\r\n \r\n<form class="pin">\r\n    <label>Twitter PIN: <input type="text" name="pin" />\r\n    <p>\r\n        <button type="submit">Authenticate</button>\r\n    </p>\r\n</form>\r\n';
return $t;
});
}, "@VERSION@", {
    requires : [
        "template"
    ]
});
