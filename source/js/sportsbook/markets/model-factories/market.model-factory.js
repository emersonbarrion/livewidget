
(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.markets");

    module.factory("marketModelFactory", ["resourceRepository", "lodash", "selectionModelFactory", function (repositories, _, SelectionModelFactory) {
        function MarketModel(market) {
            this.eventId = market.eventId;

            this.id = market.id;
            this.eventName = market.eventName;
            this.name = market.name;
            this.deadline = market.deadline;
            this.text = market.text;
            this.ruleId = market.ruleId;
            this.betGroup = market.betGroup;
            this.lineValue = market.lineValue;
            this.isHeadToHead = market.isHeadToHead;
            this.isOnHold = market.isOnHold;

            this.subCategoryId = market.subCategoryId;
            this.categoryId = market.categoryId;
            this.regionId = market.regionId;

            this.selections = _.map(market.selections, function (selection) {
                return new SelectionModelFactory(selection);
            });
        }

        MarketModel.prototype.getSelections = function () {
            return this.selections;
        };

        MarketModel.prototype.getParent = function () {
            return repositories.get("events").resourcesById[this.eventId];
        };

        return MarketModel;
    }]);

}(window.angular));
