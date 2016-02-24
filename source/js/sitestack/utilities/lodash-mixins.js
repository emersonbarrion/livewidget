(function (lodash) {
    "use strict";

    lodash.mixin({

        /**
         * @description
         * Removes a key from a dictionary based on the provided predicate.
         * @param  {object} o - The dictionary object.
         * @param  {(function|object|string|number)} predicate - Can be either a function that returns a boolean predicate, an object to match the properties, or a primitive value to match.
         */
        removeFromDict: function (dictionary, predicate) {
            var passesPredicate = function (value) {
                if (typeof predicate === "function") {
                    return predicate(value);
                } else if (typeof predicate === "object") {
                    return _.matches(predicate)(value);
                } else {
                    return (predicate === value);
                }
            };
            var deleteWherePredicate = function (value, key) {
                if (passesPredicate(value)) {
                    delete dictionary[key];
                }
            };
            _.forOwn(dictionary, deleteWherePredicate);
        }

    });

})(window._);
