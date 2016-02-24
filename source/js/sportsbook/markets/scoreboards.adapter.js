(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.markets');

    var isa2ScoreboardsAdapterClass = function () {};

    var countStatisticsByParticipant = function (participants, data, statisticType) {

        var score = {};

        _.forEach(participants, function (participant) {

            score[participant.pi] = {
                "total": _.chain(data)
                    .find({
                        "sti": statisticType,
                        "spi": participant.pi,
                        "gpi": 15
                    })
                    .value(),
                "byPhase": countStatisticsByParticipantAndPhase(data, statisticType, participant.pi)
            };

            score[participant.pi].total = (score[participant.pi].total) ? score[participant.pi].total.v : "0";
        });

        return score;
    };

    var countStatisticsByParticipantAndPhase = function (data, statisticType, participantId) {
        return _.chain(data)
            .filter({
                "sti": statisticType,
                "spi": participantId
            })
            .groupBy("gpi")
            .mapValues(function (values) {
                return values[0].v;
            })
            .value();
    };

    var parseMatchClock = function (data) {

        if (!data || data.mcm === 0) {
            // Mode 0: No clock support.
            return null;
        }

        return {
            "seconds": data.s,
            "minutes": data.m,
            "isCountdown": data.mcm === 4,
            "isStopped": data.mcm === 1
        };
    };

    var parseCurrentPhase = function (data) {

        if (!data) {
            return null;
        }

        return {
            "id": data.gpi,
            "text": data.gpn
        };
    };

    var parseParticipants = function (data) {

        return _.map(data, function (p) {
            return {
                "id": p.pi,
                "name": p.pn,
                "sortOrder": p.so
            };
        });
    };

    isa2ScoreboardsAdapterClass.prototype.toAction = function (data) {
        if (_.isArray(data)) {
            return _.map(data, function (element) {
                return this.toAction(element);
            }, this);
        }

        return {
            "type": data.ati,
            "name": data.an,
            "participantId": data.api,
            "date": new Date(data.dt)
        };
    };

    isa2ScoreboardsAdapterClass.prototype.toScoreboard = function (data, event) {

        if (_.isArray(data)) {
            return _.map(data, function (element) {
                return this.toScoreboard(element);
            }, this);
        }

        var scoreboard = {
            "event": (event) ? event : {
                "id": data.ei
            },
            "score": countStatisticsByParticipant(data.pl, data.gsl, 1), // Goals (Id 1 is used for most games)
            "matchClock": parseMatchClock(data.gmc),
            "participants": _.sortBy(parseParticipants(data.pl), "sortOrder"),
            "currentPhase": parseCurrentPhase(data.gcp),
            "server": countStatisticsByParticipant(data.pl, data.gsl, 10),
            "actions": this.toAction(data.gal),
            "stats": {
                "yellowCards": countStatisticsByParticipant(data.pl, data.gsl, 2),
                "redCards": countStatisticsByParticipant(data.pl, data.gsl, 3),
                "corners": countStatisticsByParticipant(data.pl, data.gsl, 7),
                "gamePoints": countStatisticsByParticipant(data.pl, data.gsl, 9),
                "gamePoint": countStatisticsByParticipant(data.pl, data.gsl, 11),
                "penaltyShots": countStatisticsByParticipant(data.pl, data.gsl, 12),
                "substitutions": countStatisticsByParticipant(data.pl, data.gsl, 13),
                "setPoints": countStatisticsByParticipant(data.pl, data.gsl, 14),
                "tieBreakPoints": countStatisticsByParticipant(data.pl, data.gsl, 15),
                "penalty": countStatisticsByParticipant(data.pl, data.gsl, 16),
                "hitScored": countStatisticsByParticipant(data.pl, data.gsl, 17),
                "base1": countStatisticsByParticipant(data.pl, data.gsl, 18),
                "base2": countStatisticsByParticipant(data.pl, data.gsl, 19),
                "base3": countStatisticsByParticipant(data.pl, data.gsl, 20),
                "outs": countStatisticsByParticipant(data.pl, data.gsl, 21),
                "inningRuns": countStatisticsByParticipant(data.pl, data.gsl, 22)
            }
        };

        return scoreboard;
    };

    module.service("scoreboardsAdapter", ["lodash", isa2ScoreboardsAdapterClass]);
}(window.angular));
