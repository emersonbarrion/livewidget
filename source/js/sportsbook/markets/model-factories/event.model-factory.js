
(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.markets");

    module.factory("eventModelFactory", ["resourceRepository", "lodash", function (repositories, _) {
        function EventModel(event) {
            this.id = event.id;
            this.name = event.name;
            this.shortName = event.shortName;
            this.startDateTime = event.startDateTime;
            this.isLive = event.isLive;
            this.liveEvent = event.liveEvent;
            this.eventPhase = event.eventPhase;

            this.liveStream = event.liveStream;
            this.category = event.category;
            this.region = event.region;
            this.subCategory = event.subCategory;

            this.participants = event.participants;
            this.scoreboard = event.scoreboard;

            this.streams = event.streams;

            this.sortRank = event.sortRank;
            this.marketCount = event.marketCount;
        }

        EventModel.prototype.getMarkets = function () {
            var self = this;

            return _.filter(repositories.get("markets").resourcesById, function (market) {
                return market.eventId === self.id;
            });
        };

        return EventModel;
    }]);

}(window.angular));