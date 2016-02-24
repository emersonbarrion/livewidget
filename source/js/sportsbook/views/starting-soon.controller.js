(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.views");

    module.controller('startingSoonCtrl', ['$scope', 'lodash', '$q', 'startingSoonPage', 'catalogueService', 'eventSortFields',
        function ($scope, _, $q, startingSoonPage, catalogueService, eventSortFields) {
            $scope.prematchMultipleEventTables = startingSoonPage.prematchMultipleEventTables;

            $scope.setCategory = function (categoryId) {
                startingSoonPage.updateFilters({
                    eventSortBy: eventSortFields.DATE, //Should be sorted by date and popularity do an enum
                    eventCount: 50,
                    categoryIds: [categoryId]
                });
            };

            startingSoonPage.registerDataSourceListeners($scope);
        }
    ]);
}(window.angular));
