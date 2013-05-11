YUI.add("extension-view-classes", function(Y) {
    "use strict";
    
    var ViewClasses = function() {};
    
    ViewClasses.prototype = {
        initializer: function() {
            Y.Do.after(this._addViewClasses, this, "_attachView", this);
        },
        
        _addViewClasses : function() {
            var view = this.get("activeView");
            
            view.get("container").addClass(
                ViewClasses.CLASS_NAMES.view + " " +
                view.name.toLowerCase() +
                (view.css ? " " + view.css : "")
            );
        }
    };
    
    ViewClasses.CLASS_NAMES = {
        view : Y.ClassNameManager.getClassName("app", "view")
    };
    
    Y.namespace("Extensions").ViewClasses = ViewClasses;
    
}, "@VERSION@", {
    requires: [
        "event-custom"
    ]
});
