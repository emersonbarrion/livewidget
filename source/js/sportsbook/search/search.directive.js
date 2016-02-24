(function(angular) {
    "use strict";

    var module = angular.module('sportsbook.search');

    /* istanbul ignore next */
    module.directive("bsnSearch", ['sportsbookConfiguration', function(sportsbookConfiguration) {
        return {
            restrict: "A",
            controller: "searchCtrl",
            templateUrl: sportsbookConfiguration.templates.search
        };
    }]);

}(window.angular));
