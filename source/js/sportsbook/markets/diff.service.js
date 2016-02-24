(function (angular) {
    "use strict";

    var diff = function () {};

    var difference = function (context, a, b, property, comparer) {
        if (_.isArray(a) && _.isArray(b)) {

            return _.chain(a).map(function (o) {

                var n = _.find(b, {
                    "id": o.id
                });
                return (n) ? context[property](o, n) : null;
            }).compact().value();
        }

        return comparer(context, a, b);
    };

    var processSelections = function (context, oldSelection, newSelection) {
        var selectionDiff = {
            id: newSelection.id
        };

        var containsDiff = false;
        var containsOddsChange = false;
        var containsHoldStatusChange = false;

        if (oldSelection.odds !== newSelection.odds) {
            selectionDiff.oldOdds = oldSelection.odds;
            selectionDiff.newOdds = newSelection.odds;

            containsOddsChange = true;
            containsDiff = true;
        }

        if (oldSelection.name !== newSelection.name) {
            selectionDiff.newName = newSelection.name;

            containsDiff = true;
        }

        if (oldSelection.marketName !== newSelection.marketName) {
            selectionDiff.newMarketName = newSelection.marketName;

            containsDiff = true;
        }

        if (oldSelection.eventName !== newSelection.eventName) {
            selectionDiff.newEventName = newSelection.eventName;

            containsDiff = true;
        }

        if (oldSelection.isOnHold !== newSelection.isOnHold) {
            selectionDiff.newIsOnHold = newSelection.isOnHold;

            containsHoldStatusChange = true;
            containsDiff = true;
        }

        selectionDiff.oddsChange = containsOddsChange;
        selectionDiff.holdStatusChange = containsHoldStatusChange;

        if (containsDiff) {
            return selectionDiff;
        } else {
            return null;
        }
    };

    var processMarkets = function (context, oldMarket, newMarket) {
        var marketDiff = {
            id: newMarket.id,
            eventId: newMarket.eventId
        };
        var containsDiff = false;

        var selectionDiffs = context.selections(oldMarket.selections, newMarket.selections);

        if (!_.isEmpty(selectionDiffs)) {
            marketDiff.selectionDiffsById = _.indexBy(selectionDiffs, "id");
            containsDiff = true;
        }

        if (oldMarket.eventName !== newMarket.eventName) {
            marketDiff.newEventName = newMarket.eventName;
            containsDiff = true;
        }

        if (oldMarket.name !== newMarket.name) {
            marketDiff.newName = newMarket.name;
            containsDiff = true;
        }

        if (oldMarket.isOnHold !== newMarket.isOnHold) {
            marketDiff.newIsOnHold = newMarket.isOnHold;
            containsDiff = true;
        }

        if (oldMarket.betGroup.name !== newMarket.betGroup.name) {
            marketDiff.newBetGroupName = newMarket.betGroup.name;
            containsDiff = true;
        }

        marketDiff.oddsChange = _.some(selectionDiffs, function (s) {
            return s.oddsChange;
        });
        marketDiff.holdStatusChange = _.some(selectionDiffs, function (s) {
            return s.holdStatusChange;
        });

        if (containsDiff) {
            return marketDiff;
        } else {
            return null;
        }
    };

    var processEvents = function (context, oldEvent, newEvent) {
        var eventDiff = {
            id: newEvent.id
        };

        if (oldEvent.name !== newEvent.name) {
            eventDiff.newName = newEvent.name;
        }

        if (oldEvent.marketCount !== newEvent.marketCount) {
            eventDiff.newMarketCount = newEvent.marketCount;
        }

        if (oldEvent.isLive !== newEvent.isLive) {
            eventDiff.newIsLive = newEvent.isLive;
        }

        var oldScoreboardPresent = _.isObject(oldEvent.scoreboard);
        var newScoreboardPresent = _.isObject(newEvent.scoreboard);

        if (oldScoreboardPresent && newScoreboardPresent) {
            var scoreboardDiff = context.scoreboards(oldEvent.scoreboard, newEvent.scoreboard);

            if (scoreboardDiff) {
                eventDiff.scoreboard = scoreboardDiff;
            }
        } else if (!oldScoreboardPresent && newScoreboardPresent) {
            eventDiff.newScoreboard = newEvent.scoreboard;
        } else if (oldScoreboardPresent && !newScoreboardPresent) {
            eventDiff.newScoreboard = null;
        } else if (!oldScoreboardPresent && !newScoreboardPresent) {
            //Do nothing
        }

        if (_.keys(eventDiff).length > 1) {
            return eventDiff;
        } else {
            return null;
        }
    };

    var processMatchClock = function (context, oldMatchClock, newMatchClock) {
        var containsDiff = false;
        var matchClockDiff = {};

        if (oldMatchClock.minutes !== newMatchClock.minutes) {
            matchClockDiff.newMinutes = newMatchClock.minutes;
            containsDiff = true;
        }

        if (oldMatchClock.seconds !== newMatchClock.seconds) {
            matchClockDiff.newSeconds = newMatchClock.seconds;
            containsDiff = true;
        }

        if (oldMatchClock.isStopped !== newMatchClock.isStopped) {
            matchClockDiff.newIsStopped = newMatchClock.isStopped;
            containsDiff = true;
        }

        if (containsDiff) {
            return matchClockDiff;
        } else {
            return null;
        }
    };

    var processCurrentPhaseDiff = function (context, oldCurrentPhase, newCurrentPhase) {
        if (oldCurrentPhase.id !== newCurrentPhase.id) {
            var currentPhaseDiff = {};

            currentPhaseDiff.newId = newCurrentPhase.id;
            currentPhaseDiff.newText = newCurrentPhase.text;

            return currentPhaseDiff;
        }

        return null;
    };

    var processScoreboards = function (context, oldBoard, newBoard) {

        if (!oldBoard || !newBoard) {
            return null;
        }

        var scoreDiff = (oldBoard.score && newBoard.score) ? context.scoreboardStatistics(oldBoard.score, newBoard.score) : null;

        var serverDiff = (oldBoard.server && newBoard.server) ? context.scoreboardStatistics(oldBoard.server, newBoard.server) : null;

        var statDiff = _.chain(newBoard.stats).keys().map(function (key) {
            var individualStatDiff = context.scoreboardStatistics(oldBoard.stats[key], newBoard.stats[key]);
            if (individualStatDiff) {
                individualStatDiff.stat = key;
            }

            return individualStatDiff;
        }).compact().value();

        var statDiffsByStat = (statDiff.length > 0) ? _.indexBy(statDiff, "stat") : null;

        var matchClockDiff = (oldBoard.matchClock && newBoard.matchClock) ? processMatchClock(context, oldBoard.matchClock, newBoard.matchClock) : null;

        var currentPhaseDiff = (oldBoard.currentPhase && newBoard.currentPhase) ? processCurrentPhaseDiff(context, oldBoard.currentPhase, newBoard.currentPhase) : null;

        return (scoreDiff !== null || serverDiff !== null || statDiffsByStat !== null || matchClockDiff !== null || currentPhaseDiff !== null) ? {
            "score": scoreDiff,
            "server": serverDiff,
            "stats": statDiffsByStat,
            "matchClock": matchClockDiff,
            "currentPhase": currentPhaseDiff
        } : null;
    };

    var processStatistics = function (context, oldStat, newStat) {

        var statDiff = _.chain(oldStat).keys().map(function (key) {

            var totalDiff = (oldStat[key].total !== newStat[key].total) ? {
                "oldValue": oldStat[key].total,
                "newValue": newStat[key].total
            } : null;

            var diffByPhase =
                _.chain(newStat[key].byPhase).keys().map(function (phase) {

                    var os = oldStat[key].byPhase[phase];
                    var ns = newStat[key].byPhase[phase];

                    if (!os) {
                        os = null;
                    }

                    if (os !== ns) {
                        return {
                            "phase": phase,
                            "oldValue": os,
                            "newValue": ns
                        };
                    }

                    return null;

                }).compact().value();

            var phaseDiffs = (_.isEmpty(diffByPhase)) ? null : _.indexBy(diffByPhase, "phase");

            return (totalDiff !== null || phaseDiffs !== null) ? {
                "participant": key,
                "total": totalDiff,
                "byPhase": phaseDiffs
            } : null;

        }).compact().value();

        return _.isEmpty(statDiff) ? null : _.indexBy(statDiff, "participant");

    };

    var processMarketCollection = function (context, oldCollection, newCollection) {

        // Determine if any markets have been added or removed.
        var changeset = context.changeset(_.pluck(oldCollection, "id"), _.pluck(newCollection, "id"));

        var diffs = context.markets(_.filter(oldCollection, function (m) {
            return _.contains(changeset.other, m.id);
        }), _.filter(newCollection, function (m) {
            return _.contains(changeset.other, m.id);
        }));

        var deletedMarketIds = {};
        _.forEach(changeset.removed, function (id) {
            deletedMarketIds[id] = true;
        });

        return (!_.isEmpty(diffs) || changeset.added > 0 || changeset.removed > 0) ? {
            "marketDiffsById": _.indexBy(diffs, "id"),
            "newMarkets": _.filter(newCollection, function (m) {
                return _.contains(changeset.added, m.id);
            }),
            "deletedMarketIdsSet": deletedMarketIds
        } : null;
    };

    diff.prototype.changeset = function (oldIds, newIds) {
        return {
            "added": _.difference(newIds, oldIds),
            "removed": _.difference(oldIds, newIds),
            "other": _.intersection(newIds, oldIds)
        };
    };

    diff.prototype.selections = function (oldSelection, newSelection) {
        return difference(this, oldSelection, newSelection, "selections", processSelections);
    };

    diff.prototype.markets = function (oldMarket, newMarket) {
        return difference(this, oldMarket, newMarket, "markets", processMarkets);
    };

    diff.prototype.marketCollections = function (oldMarket, newMarket) {
        return processMarketCollection(this, oldMarket, newMarket);
    };

    diff.prototype.events = function (oldEvent, newEvent) {
        return difference(this, oldEvent, newEvent, "events", processEvents);
    };

    diff.prototype.scoreboardStatistics = function (oldStat, newStat) {
        return difference(this, oldStat, newStat, "statistics", processStatistics);
    };

    diff.prototype.scoreboards = function (oldBoard, newBoard) {
        return difference(this, oldBoard, newBoard, "scoreboards", processScoreboards);
    };

    angular.module('sportsbook.markets').service("diff", diff);
}(window.angular));