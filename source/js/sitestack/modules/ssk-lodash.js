(function (angular, lodash) {
    "use strict";

    var module = angular.module("angular-sitestack-modules");

    /**
     * @ngdoc object
     * @name angular-sitestack-modules.lodash
     * @description
     * An Angular wrapper for the Lodash library.
     */
    module.factory("lodash", function() {
        return lodash;
    });

})(window.angular, window._);
