
(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.eventsTable');

    module.directive("bsnMultipleEventsTable", ['lodash', 'eqjsUtils', 'betslip', 'sportsbookConfiguration', 'statistics', "$window", function (lodash, eqjsUtils, betslip, sportsbookConfiguration, statistics, $window) {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                data: "=bsnMultipleEventsTable",
                limit: "=bsnLimit",
                configuration: "=bsnConfiguration",
                caption: "=bsnCaption",
                marketsUpdatedBroadcast: "=bsnMarketsUpdatedBroadcast",
                slug: "=?bsnSlug",
                state: "=bsnState",
                view: "@bsnView"
            },
            templateUrl: sportsbookConfiguration.templates.multipleEventsTable,
            controller: 'multipleEventsTableCtrl',
            link: function (scope, element, attrs) {

                scope.isLive = attrs.bsnState === "live";
                scope.liveLobbyUrl = sportsbookConfiguration.liveLobby;
                scope.scoreBoardFormat = sportsbookConfiguration.scoreBoardFormat;

                scope.showAll = false;

                scope.toggle = function () {
                    scope.showAll = !scope.showAll;
                };

                scope.scoreBoard = function (eventRow) {
                    return scope.scoreBoardFormat.replace("{sport}", eventRow.configuration.scoreboard ? eventRow.configuration.scoreboard : "default");
                };

                scope.getRemainingMarkets = function (index, eventRow) {

                    // SSK-798 - Calculate the number of markets based on visible populated bet groups.
                    var totalMarkets = eventRow.marketCount;

                    // SSK-798 - Floor the value to 0.
                    // Market count may be 0 if the number of markets in the event is less than the number of visible columns.
                    if (totalMarkets === 0) {
                        return 0;
                    }

                    // Count the number of visible bet groups we have up to the index.
                    var i = 0;
                    var numberOfDisplayableBetGroups = 0;
                    while (i <= index) {
                        if (eventRow.marketCells && eventRow.marketCells[i].selections && eventRow.marketCells[i].selections.length > 0) {
                            numberOfDisplayableBetGroups++;
                        }
                        i++;
                    }

                    return Math.max(totalMarkets - numberOfDisplayableBetGroups, 0);
                };

                scope.addToBetslip = function (selection) {
                    if (selection.isOnHold) {
                        $window.alert("This market is currently on hold.");
                        return;
                    }
                    betslip.add(selection);
                };

                scope.isInCoupon = function (selection) {
                    return betslip.isInCoupon(selection);
                };

                scope.isEligible = function (selection) {
                    return betslip.isEligible(selection);
                };

                scope.isWinner = function (phaseIndex, gamePoints, currentParticipantId, currentParticipantScore, eventParticipants) {
                    var oppenentid;

                    _.each(eventParticipants, function (participant) {
                        if (participant.id !== currentParticipantId) {
                            oppenentid = participant.id;
                        }
                    });

                    var opponentsScore = _.omit(gamePoints, currentParticipantId);
                    return parseInt(opponentsScore[oppenentid].byPhase[phaseIndex + 1]) < currentParticipantScore;
                };

                scope.isServer = function (serverValue) {
                    var result = false;
                    if (serverValue === 1) {
                        result = true;
                    }

                    return result;
                };

                scope.getStats = function (eventRow) {
                    // if stats are not visible
                    if (!eventRow.showStats) {

                        //at the moment all the data is being retrieved sequentially, but probably this would be lazy-loaded
                        if (scope.data.competitionNode && scope.data.competitionNode.externalId && eventRow.statisticsId !== 'null') {
                            // retrieve the table data
                            statistics.getTable(eventRow.statisticsId, {
                                fields: 'gp,w,d,l,ga,gf,gd,pts'
                            }).then(function (data) {
                                // add the data to the event object
                                eventRow.statistics.table = data;
                            });

                            if (eventRow.participants) {
                                // retrieve the standings data
                                statistics.getStandings(eventRow.statisticsId, {
                                    participants: _.pluck(eventRow.participants, "externalId").join(","), // TODO: participant IDs are hard-coded,
                                    fields: 'gp,w,d,l,ga,gf,gd,pts'
                                }).then(function (data) {
                                    // add the data to the event object
                                    eventRow.statistics.standings = data;
                                });
                            }
                        }

                        if (eventRow.participants) {
                            // retrieve the headToHead data
                            statistics.getHeadToHead(5, {
                                participants: _.pluck(eventRow.participants, "externalId").join(",") // TODO: participant IDs are hard-coded
                            }).then(function (data) {
                                // add the data to the event object
                                eventRow.statistics.headToHead = data;
                            });

                            // retrieve the fixtures data
                            statistics.getFixtures(0, 0, 5, {
                                participants: _.pluck(eventRow.participants, "externalId").join(","), // TODO: participant IDs are hard-coded
                                adv: 0,
                            }).then(function (data) {
                                // add the data to the eventRow object
                                eventRow.statistics.fixtures = data;
                            });
                        }
                    }

                    // toggle the stats
                    eventRow.showStats = !eventRow.showStats;
                };

                var nodes = eqjsUtils.find(element);

                eqjsUtils.query(nodes);
            }
        };
    }]);


    module.controller('multipleEventsTableCtrl', ['$scope', 'lodash',
        function ($scope, lodash) {
            $scope.eventRows = ($scope.data && $scope.data.eventRows) ? $scope.data.eventRows : [];
            $scope.headers = ($scope.data && $scope.data.headers) ? $scope.data.headers : [];
        }
    ]);


}(window.angular));
