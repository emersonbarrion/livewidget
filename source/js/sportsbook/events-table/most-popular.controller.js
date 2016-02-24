
(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.eventsTable");

    module.directive("sskPopular", [
        function () {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    dataSourceName: "@datasourcename",
                    categoryIds: "=ids",
                    categoryLimit: "=topcategories",
                    limit: "=limit",
                },
                templateUrl: "/templates/sportsbook/events-table/most-popular.html",
                controller: "popularEventsController",
            };
        }
    ]);

    module.controller("popularEventsController", ["$scope", "lodash", "mostPopularService", "catalogue", function ($scope, _, mostPopularService, catalogue) {

        $scope.data = [];

        $scope.loadEventsForCategory = function (category) {
            return mostPopularService.getData(category.id, $scope.dataSourceName, $scope.limit).then(function (viewModel) {
                $scope.data.length = 0;
                $scope.data.push.apply($scope.data, viewModel);
            });
        };

        $scope.selectCategory = function (category) {
            if (!category) {
                return;
            }
            $scope.currentCategory = category;
            $scope.loadEventsForCategory($scope.currentCategory);
        };

        mostPopularService.getCategories({ categoryIds: $scope.categoryIds, limit: $scope.categoryLimit }).then(function (categories) {
			$scope.categories = categories;
            $scope.hasMultipleCategories = $scope.categories.length > 1;
			// Select the first category.
            $scope.selectCategory(($scope.categories.length > 0) ? $scope.categories[0] : null);
        });

        mostPopularService.registerDataSourceListeners($scope, $scope.data, $scope.dataSourceName);
    }]);

})(angular);
