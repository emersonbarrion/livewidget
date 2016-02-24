(function(angular) {
    "use strict";

    var module = angular.module('sportsbook.bets');

    /* istanbul ignore next */
    module.directive("manualAttest", ['sportsbookConfiguration', function(sportsbookConfiguration) {
        return {
            scope:"=",
            restrict: "A",
            controller: "manualAttestController",
            templateUrl: sportsbookConfiguration.templates.manualAttest
        };
    }]);

}(window.angular));
