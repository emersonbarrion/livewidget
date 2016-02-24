(function(angular, eqjs) {
    "use strict";

    var module = angular.module("angular-sitestack-modules");

    /**
     * @ngdoc object
     * @name angular-sitestack-modules.eqjsUtils
     * @description
     * An Angular wrapper for the eqjs library, providing useful "query" and "find" methods.
     */
    module.factory("eqjsUtils", function() {
        return {

            /**
             * @ngdoc method
             * @name angular-sitestack-modules.eqjsUtils#query
             * @methodOf angular-sitestack-modules.eqjsUtils
             * @description
             * Delegates calls to the eq.js query method.
             *
             * @param  {DOMElement[]} nodes -
             * @param  {Function} callback -
             */
            query: function(nodes, callback) {
                eqjs.query(nodes, callback);
            },

            /**
             * @ngdoc method
             * @name angular-sitestack-modules.eqjsUtils#find
             * @methodOf angular-sitestack-modules.eqjsUtils
             * @description
             * Finds elements that are set up with eq.js responsive points.
             *
             * @param  {DOMElement[]} nodes - A collection of nodes to search in.
             * @return {DOMElement[]} - The found nodes.
             */
            find: function(nodes) {
                var elements = [];

                if (!nodes) {
                    return elements;
                }

                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i].querySelector("[data-eq-pts]");
                    if (node) {
                        elements.push(node);
                    }
                }

                return elements;
            }
        };
    });

})(window.angular, window.eqjs);
