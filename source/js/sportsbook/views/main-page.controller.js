(function (angular) {
    'use strict';

    var module = angular.module('sportsbook.views');

    module.controller("genericPageCtrl", [
        function () {}
    ]);

    module.controller("mainPageCtrl", ["$scope", "$rootScope", "$q", "homePage", "liveEventTableViewModelAdapterByCategory", "eventTableViewModelAdapterByCompetition",
        function ($scope, $rootScope, $q, homePage) {
            $scope.data = homePage;

            $scope.mostPopular = homePage.mostPopular;
            $scope.startingSoon = homePage.startingSoon;
            $scope.multipleEventsTables = homePage.multipleEventsTables;
            $scope.liveMultipleEventsTables = homePage.liveMultipleEventsTables;
            $scope.winnerLists = homePage.winnerLists;

            homePage.registerDataSourceListeners($scope);
        }
    ]);
}(window.angular));
