
(function (angular) {
    'use strict';

    angular
        .module('sportsbook.catalogue')
        .directive("catalogueList", ['sportsbookConfiguration', function (sportsbookConfiguration) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: sportsbookConfiguration.templates.catalogueList,
                controller: "catalogueController"
            };
        }]);

}(angular));