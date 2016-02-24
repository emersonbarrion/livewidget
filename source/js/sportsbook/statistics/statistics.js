(function(angular) {
    "use strict";

    var module = angular.module('sportsbook.statistics');

    /**
     * @ngdoc directive
     * @name sportsbook.statistics.directive:statisticsEvent
     * @requires sportsbook.sportsbookConfiguration
     */
    module.directive("statisticsEvent", ['sportsbookConfiguration', function(sportsbookConfiguration) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                data: "=data",
            },
            templateUrl: sportsbookConfiguration.templates.statisticsEvent
        };
    }]);

    /**
     * @ngdoc directive
     * @name sportsbook.statistics.directive:statisticsTable
     * @requires sportsbook.sportsbookConfiguration
     */
    module.directive("statisticsTable", ['sportsbookConfiguration', function(sportsbookConfiguration) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                data: "=data",
            },
            templateUrl: sportsbookConfiguration.templates.statisticsTable
        };
    }]);

    /**
     * @ngdoc directive
     * @name sportsbook.statistics.directive:statisticsHeadToHead
     * @requires sportsbook.sportsbookConfiguration
     */
    module.directive("statisticsHeadToHead", ['sportsbookConfiguration', function(sportsbookConfiguration) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                data: "=data",
            },
            templateUrl: sportsbookConfiguration.templates.statisticsHeadToHead
        };
    }]);

    /**
     * @ngdoc directive
     * @name sportsbook.statistics.directive:statisticsFixtures
     * @requires sportsbook.sportsbookConfiguration
     */
    module.directive("statisticsFixtures", ['sportsbookConfiguration', function(sportsbookConfiguration) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                data: "=data",
            },
            templateUrl: sportsbookConfiguration.templates.statisticsFixtures
        };
    }]);

    /**
     * @ngdoc directive
     * @name sportsbook.statistics.directive:statisticsStandings
     * @requires sportsbook.sportsbookConfiguration
     */
    module.directive("statisticsStandings", ['sportsbookConfiguration', function(sportsbookConfiguration) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                data: "=data",
            },
            templateUrl: sportsbookConfiguration.templates.statisticsStandings
        };
    }]);

}(window.angular));
