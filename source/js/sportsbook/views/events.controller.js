(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.views");

    module.controller("eventSectionCtrl", ["$q", "$scope", "$rootScope", "$state", "$location", "$window", "betslip", "lodash", "eventPage", "sportsbookConfiguration", "applicationState",
        function ($q, $scope, $rootScope, $state, $location, $window, betslip, _, eventPage, sportsbookConfiguration, applicationState) {

            $scope.event = eventPage.marketSelections.event;
            $scope.marketSelections = eventPage.marketSelections;
            eventPage.registerDataSourceListeners($scope);

            $scope.$on("pageData-updated", function (broadcast, data) {
                if (data[0].newIsLive && data[0].id === $scope.event.id) {
                    $q.all({
                        culture: applicationState.culture(),
                        competition: applicationState.competition()
                    }).then(function (params) {
                        $scope.marketSelections.isLive = true;
                        $location.path(params.competition.liveSlug + "/" + $scope.event.shortName);
                    });
                }
            });

            $scope.addToBetslip = function (selection) {
                if (selection.isOnHold) {
                    $window.alert("This market is currently on hold.");
                    return;
                }
                betslip.add(selection);
            };

            $scope.isInCoupon = function (selection) {
                return betslip.isInCoupon(selection);
            };

            $scope.isEligible = function (selection) {
                return betslip.isEligible(selection);
            };

            $scope.scoreBoard = function () {
                return sportsbookConfiguration.detailedScoreBoardFormat.replace("{sport}", $scope.marketSelections.configuration.scoreboard ? $scope.marketSelections.configuration.scoreboard : "default");
            };

            $scope.isParticipantServing = function (participantId) {
                return $scope.event.scoreboard.server[participantId].total === "1";
            };

            $scope.$on("pageData-deleted", function () {
                // SSK-1075 Redirect to competition when an event is removed
                $state.go("^.^.page");
            });

        }
    ]);
}(window.angular));
