(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.directives");

    module.directive("bsnOdds", ["$timeout", "sportsbookConfiguration", function($timeout, sportsbookConfiguration) {
        return {
            restrict: "A",
            replace: false,
            scope: {
                odds: "=bsnOdds"
            },
            templateUrl: sportsbookConfiguration.templates.odds,
            link: function (scope) {

                scope.oldOdds = angular.copy(scope.odds);

                scope.hasDifference = function() {
                    return scope.oldOdds && (scope.odds - scope.oldOdds) !== 0;
                };

                scope.$watch("odds", function (newValue, oldValue) {
                    scope.oldOdds = oldValue;

                    $timeout(function () {
                        scope.oldOdds = scope.odds;
                    }, 2000);
                });
            }
        };
    }]);
}(window.angular));
