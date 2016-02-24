
(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.statistics');

    var DATE_FORMAT = "yyyy-MM-dd HH:mm";

    var StatisticsAdapterClass = function (lodash) {
        _ = lodash;
    };

    StatisticsAdapterClass.prototype.toRow = function (data) {
        if (data) {
            return {
                gp: data.gp,
                pts: data.pts,
                w: data.w,
                d: data.d,
                l: data.l,
                gf: data.gf,
                ga: data.ga,
                gd: data.gd
            };
        }

        return undefined;
    };

    // maps the data into the league Table
    StatisticsAdapterClass.prototype.toTable = function (data, dateFormat) {
        var self = this;

        if (!dateFormat) {
            dateFormat = DATE_FORMAT;
        }

        if (data && data.tables) {
            // retrieve the table data
            var table = data.tables[0];
            return {
                lastUpdatedDate: moment(table.lastUpdatedDate, dateFormat).toDate(),
                leagueId: table.leagueId,
                leagueName: table.leagueName,
                seasonId: table.seasonId,
                sportId: table.sportId,
                lines: _.map(table.tableLines, function (line) {
                    return {
                        start: line.start,
                        end: line.end,
                        name: line.name,
                        nextLeagueId: line.nextLeagueId,
                    };
                }),
                rows: _.map(table.tableRows, function (row) {
                    return {
                        pos: row.pos,
                        team: {
                            id: row.team.id,
                            name: row.team.name,
                            shortName: row.team.shortName,
                        },
                        home: self.toRow(row.home),
                        away: self.toRow(row.away),
                        total: self.toRow(row.total)
                    };
                })
            };

        }

        return undefined;
    };

    // maps the data into the participant objects
    StatisticsAdapterClass.prototype.toParticipants = function (data, dateFormat) {
        var self = this;

        if (!dateFormat) {
            dateFormat = DATE_FORMAT;
        }

        if (data && data.participants) {
            return _.map(data.participants, function (participant) {
                return {
                    id: participant.id,
                    name: participant.name,
                    shortName: participant.shortName,
                    events: self.toEvents({
                        events: participant.events
                    }, dateFormat)
                };
            });
        }
        return undefined;
    };

    // maps the data into the event objects
    StatisticsAdapterClass.prototype.toEvents = function (data, dateFormat) {
        if (!dateFormat) {
            dateFormat = DATE_FORMAT;
        }

        if (data && data.events) {
            return _.map(data.events, function (event) {
                return {
                    id: event.id,
                    date: moment(event.date, dateFormat).toDate(),
                    league: event.league,
                    season: event.season,
                    awayId: event.awayId,
                    awayName: event.awayName,
                    awayScore: event.awayScore,
                    awayShortName: event.awayShortName,
                    homeId: event.homeId,
                    homeName: event.homeName,
                    homeScore: event.homeScore,
                    homeShortName: event.homeShortName
                };
            });
        }

        return undefined;
    };

    module.service("statisticsAdapter", ["lodash", StatisticsAdapterClass]);
}(window.angular));
