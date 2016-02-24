(function (angular) {
    "use strict";

    var selectionChunkerClass = function () {
    };

    var defaultChunking = function (selections, configuration) {
        return _.chain(selections).sortBy("sortOrder").chunk(configuration.columns).value();
    };

    var correctScoreChunking = function (selections, configuration) {
        var lowest = 1000;
        var highest = 0;

        var items = _.chain(selections).map(function (selection) {

            var score = _.map(selection.name.split("-"), function (part) {
                return parseInt(part);
            });

            lowest = Math.min(lowest, score[0]);
            lowest = Math.min(lowest, score[1]);

            highest = Math.max(highest, score[0]);
            highest = Math.max(highest, score[1]);

            return {
                "home": score[0],
                "away": score[1],
                "type": score[0] > score[1] ? 0 : score[0] === score[1] ? 1 : 2,
                "model": selection
            };
        }).groupBy("type").value();

        items[0] = _.sortByAll(items[0], ["home", "away"]);
        items[1] = _.sortByAll(items[1], "home");
        items[2] = _.sortByAll(items[2], ["away", "home"]);

        var rows = [];

        // Break into a matrix
        while (!_.isEmpty(items[0]) || !_.isEmpty(items[1]) || !_.isEmpty(items[2])) {

            var home = (items[0][0]) ? items[0].shift().model : null;
            var draw = (items[1][0]) ? items[1].shift().model : null;
            var away = (items[2][0]) ? items[2].shift().model : null;

            if (home === null && draw === null && away === null) {
                continue;
            }

            rows.push([home, draw, away]);
        }

        return rows;
    };

    var chunkingStrategies = {
        "default": defaultChunking,
        "correct-score": correctScoreChunking
    };

    selectionChunkerClass.prototype.chunk = function (selections, configuration, mode) {

        var strategy = (chunkingStrategies[mode]) ? chunkingStrategies[mode] : chunkingStrategies.default;

        return strategy(selections, configuration);

    };

    /**
     * @ngdoc service
     * @name sportsbook.markets:selectionChunker
     * @description splits selection lists into chunks for display based on different chunking strategies.
     */
    angular.module("sportsbook.markets")
        .service("selectionChunker", [selectionChunkerClass]);
}(window.angular));