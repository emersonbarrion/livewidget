(function (angular) {
    'use strict';

    var module = angular.module('sportsbook.views');

    // This directive does not specify behaviour, so is skipped for code coverage.
    /* istanbul ignore next  */
    module.directive("bsnSearchResultWidget", ['sportsbookConfiguration', function (sportsbookConfiguration) {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                result: "=bsnSearchResultWidget"
            },
            templateUrl: sportsbookConfiguration.templates.searchResultWidget
        };
    }]);

    module.controller('searchResultCtrl', ['$scope', 'lodash', '$stateParams', '$q', 'searchPage',
        function ($scope, _, $stateParams, $q, searchPage) {
            var searchTerm = $stateParams.text;
            $scope.term = searchTerm;

            $scope.liveMultipleEventTables = searchPage.liveMultipleEventTables;
            $scope.prematchMultipleEventTables = searchPage.prematchMultipleEventTables;
            $scope.prematchWinnerLists = searchPage.prematchWinnerLists;

            searchPage.registerDataSourceListeners($scope);
        }
    ]);
})(angular);
