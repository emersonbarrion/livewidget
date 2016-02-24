(function(angular) {
    "use strict";

    var module = angular.module('sportsbook.winnerList');

    // This directive does not specify behaviour, so is skipped for code coverage.
    /* istanbul ignore next  */
    module.directive("bsnWinnerMarket", ['sportsbookConfiguration', function (sportsbookConfiguration) {
        return {
            replace: true,
            scope: {
                defaultVisibleItems: "=",
                event: "=",
                betGroup: "=",
                iconHint: "=",
                market: "=",
                defaultClass: "="
            },
            templateUrl: sportsbookConfiguration.templates.winnerListWidget,
            controller: 'winnerListCtrl',
            link: function (scope, element, attrs) {
                scope.isHeadToHead = false;
            }
        };
    }]);

    // This directive does not specify behaviour, so is skipped for code coverage.
    /* istanbul ignore next  */
    module.directive("bsnWinnerMarketHeadToHead", ['sportsbookConfiguration', function (sportsbookConfiguration) {
        return {
            replace: true,
            scope: {
                defaultVisibleItems: "=",
                event: "=",
                betGroup: "=",
                iconHint: "=",
                defaultClass: "="
            },
            templateUrl: sportsbookConfiguration.templates.headToHeadListWidget,
            controller: 'winnerListCtrl',
            link: function (scope, element, attrs) {
                scope.isHeadToHead = true;
            }
        };
    }]);

    // This directive does not specify behaviour, so is skipped for code coverage.
    /* istanbul ignore next  */
    module.directive("bsnWinnerListSection", ['sportsbookConfiguration', function (sportsbookConfiguration) {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                winnerMarketViewModel: "=bsnWinnerListSection"
            },
            templateUrl: sportsbookConfiguration.templates.winnerListSection
        };
    }]);

    module.controller('winnerListCtrl', ['$scope', 'betslip', 'lodash',
        function ($scope, betslip, _) {

            $scope.addToBetslip = function (item) {
                betslip.add(item.originalObj);
                item.isInCoupon = true;
            };

            $scope.removeFromBetslip = function (item) {
                betslip.remove(item.originalObj);
                item.isInCoupon = false;
            };

            $scope.toggleSelection = function (item) {
                if (betslip.isInCoupon(item.originalObj)) {
                    $scope.removeFromBetslip(item);
                }
                else {
                    $scope.addToBetslip(item);
                }
            };

            $scope.anySelectionsInCoupon = function (selections) {
                return _.some(selections, "isInCoupon");
            };

            $scope.isInCoupon = function(item) {
                return betslip.isInCoupon(item.originalObj);
            };

            $scope.isEligible = function (item) {
                return betslip.isEligible(item.originalObj);
            };

            $scope.getVisibleItems = function (items, isShowingAll) {
                return _.filter(items, function(item, idx) {
                    return $scope.isInCoupon(item) || (idx + 1) <= (!isShowingAll ? $scope.defaultVisibleItems : items.length);
                });
            };
        }
    ]);

}(window.angular));
