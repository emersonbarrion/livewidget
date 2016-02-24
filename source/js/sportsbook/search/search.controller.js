(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.search");

    module.controller("searchCtrl", ["$scope", "$state", "$stateParams", "$log", function ($scope, $state, $stateParams, $log) {
        $scope.submit = function () {
            $log.info("Searching for:", $scope.searchText);
            $state.go("market.search", { market: $stateParams.market, text: $scope.searchText });
        };
    }]);

}(window.angular));
