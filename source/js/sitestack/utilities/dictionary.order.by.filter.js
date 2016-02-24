(function (angular) {
    "use strict";

    angular.module('angular-sitestack-utilities')
        .filter('orderDictionaryBy', function () {
            return function (items, field, reverse) {
                return _.chain(items)
                    .values()
                    .sortByOrder(field, reverse ? "desc" : "asc")
                    .value();
            };
        });
})(angular);