(function (angular) {
    'use strict';

    var module = angular.module('sportsbook.views');

    module.controller("eventListCtrl", [
        '$scope', '$rootScope', '$q', 'applicationState', 'eventListPage',

        function ($scope, $rootScope, $q, applicationState, eventListPage) {
            $scope.timespans = [{
                label: "All",
                value: null
            }, {
                label: "30m",
                value: {
                    span: 30,
                    type: "minute"
                }
            }, {
                label: "1h",
                value: {
                    span: 1,
                    type: "hour"
                }
            }, {
                label: "24h",
                value: {
                    span: 24,
                    type: "hour"
                }
            }, {
                label: "32h",
                value: {
                    span: 2,
                    type: "days"
                }
            }, {
                label: "72h",
                value: {
                    span: 3,
                    type: "days"
                }
            }];

            $scope.filterDataByTimespan = function (value) {
                $rootScope.$broadcast("loading-main-working");

                eventListPage.updateFilters(
                    _.assign({}, eventListPage.filters, {eventStartFrom: (value) ? moment() : null,

                        eventStartTo: (value) ? moment().add(value.span, value.type) : null
                    })
                ).then(function () {
                    $rootScope.$broadcast("loading-main-ready");
                });

            };

            // add the active competition to the scope
            applicationState.competition().then(function (response) {
                $scope.activeCompetition = response;
            });

            $scope.prematchWinnerLists = eventListPage.prematchWinnerLists;
            $scope.prematchMultipleEventTables = eventListPage.prematchMultipleEventTables;
            $scope.liveMultipleEventTables = eventListPage.liveMultipleEventTables;

            eventListPage.registerDataSourceListeners($scope);

        }
    ]);

}(window.angular));
