var defineDescendant = (function() {
    "use strict";

    var defineDescendant = function (parent, ctor, boundArguments) {
        
        // Required due to UI router's state builder.
        if (_.isUndefined(parent.prototype)) {
            return null;
        }

        if (_.isUndefined(boundArguments)) {
            boundArguments = [];
        }

        var child = function () {

            var args = boundArguments.concat(_.values(arguments));

            parent.apply(this, args);
            ctor.apply(this, args);
        };

        child.prototype = Object.create(parent.prototype);
        child.constructor = ctor;

        return child;
    };

    return defineDescendant;
})();