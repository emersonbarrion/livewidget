(function (angular) {
    'use strict';

    var module = angular.module('sportsbook.views');

    module.controller("livePageCtrl", [
        '$scope', '$rootScope', '$q', 'applicationState', 'liveTableByCategoryPage',

        function ($scope, $rootScope, $q, applicationState, liveTableByCategoryPage) {
            $scope.liveMultipleEventTables = liveTableByCategoryPage.liveMultipleEventTables;

            liveTableByCategoryPage.registerDataSourceListeners($scope);

        }
    ]);

}(window.angular));
