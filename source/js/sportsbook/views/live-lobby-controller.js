(function (angular) {
    'use strict';

    var module =
        angular
        .module('sportsbook.views')
        .controller("liveLobbyCtrl", ["$scope", "liveLobbyPage", function ($scope, liveLobbyPage) {
            $scope.data = liveLobbyPage;
            $scope.liveMultipleEventsTables = liveLobbyPage.liveMultipleEventsTables;

            liveLobbyPage.registerDataSourceListeners($scope);
        }]);
}(window.angular));
