
(function (angular) {
    'use strict';

    var sportsbookControllers = angular.module('sportsbook.betHistory');

    sportsbookControllers.controller('bethistoryCtrl', ['$scope', '$rootScope', 'lodash', 'betHistory', 'betHistoryControllerConfig', 'moment', 'applicationState', '$q', 'couponTypes',
        function ($scope, $rootScope, lodash, betHistory, betHistoryControllerConfig, moment, applicationState, $q, couponTypes) {
            $scope.fromDate = moment().subtract(betHistoryControllerConfig.daysToGoBack, "days").toDate();
            $scope.toDate = moment().toDate();

            $scope.selectedBetFilter = String(betHistoryControllerConfig.defaultFilter);
            $scope.betFilters = lodash.map(betHistory.getTranslationKeysByBetFilter(), function (translationKey, betFilter) {
                return {
                    id: betFilter,
                    translationKey: translationKey
                };
            });

            $scope.selectedPage = 0;
            $scope.pages = [0];

            $scope.betHistoryItems = [];

            $scope.couponTypes = {};
            $scope.couponTypes[couponTypes.single] = "Single";
            $scope.couponTypes[couponTypes.combi] = "Combi";
            $scope.couponTypes[couponTypes.system] = "System";

            var isLoading = false;

            function loadBetHistoryByPage(page) {
                if (lodash.isUndefined(page)) {
                    page = 0;
                }

                $scope.selectedPage = page;

                if (!isLoading) {
                    isLoading = true;

                    $rootScope.$broadcast("loading-bet-history-working");
                    return applicationState.user().then(function (user) {
                        if (!user.isAuthenticated) {
                            $rootScope.$broadcast("loading-bet-history-error", {
                                message: "error.Authentication",
                                noDismiss: true
                            });
                        } else {
                            return betHistory.getHistoryWithDetails({
                                fromDate: $scope.fromDate,
                                toDate: moment($scope.toDate).add(1, "days"),
                                numberOfCoupons: betHistoryControllerConfig.numberOfCoupons,
                                betFilter: $scope.selectedBetFilter,
                                pageNumber: page
                            }).then(function (data) {
                                $scope.betHistoryItems = lodash.map(data.betHistoryItems,
                                    function (betHistoryItem) {
                                        var betHistoryItemViewModel = angular.extend({}, betHistoryItem);
                                        betHistoryItemViewModel.showDetails = false;

                                        return betHistoryItem;
                                    }
                                );

                                $scope.pages = lodash.range(data.numberOfPages);
                                $scope.totalNumberOfCoupons = data.numberOfCoupons;

                                $rootScope.$broadcast("loading-bet-history-ready");
                            });
                        }

                    }).catch(function () {
                        $rootScope.$broadcast("loading-bet-history-error", {
                            message: "sportsbook.error.bethistory.Failed",
                            noDismiss: true,
                            retryFn: loadBetHistoryByPage
                        });
                    }).finally(function () {
                        isLoading = false;
                    });
                } else {
                    return $q.reject("Already loading");
                }
            }

            $scope.toggleDetails = function (item) {
                item.showDetails = !item.showDetails;
            };

            $scope.loadBetHistoryByPage = function (page) {
                loadBetHistoryByPage(page);
            };

            loadBetHistoryByPage().finally(function () {
                applicationState.user.subscribe(function () {
                    loadBetHistoryByPage();
                });
            });
        }
    ]);

}(window.angular));