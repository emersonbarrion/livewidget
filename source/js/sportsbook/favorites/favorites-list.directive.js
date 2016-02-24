(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.favorites");

    /**
     * @ngdoc directive
     * @name sportsbook.favorites.directive:favoritesList
     * @requires sportsbook.configuration.sportsbookConfiguration
     * @param {array} data - The favorites list to bind.
     */
    /* istanbul ignore next */
    module.directive("favoritesList", ["sportsbookConfiguration", function (sportsbookConfiguration) {
        return {
            restrict: "A",
            replace: true,
            scope: {
                data: "="
            },
            templateUrl: sportsbookConfiguration.templates.favorites
        };
    }]);

})(window.angular);
