
(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.markets");

    module.factory("selectionModelFactory", ["resourceRepository", "lodash", function (repositories, _) {
        function SelectionModel(selection) {
            this.marketId = selection.marketId;
            this.eventId = selection.eventId;

            this.marketName = selection.marketName;
            this.eventName = selection.eventName;

            this.ruleId = selection.ruleId;
            this.isLive = selection.isLive;

            this.betGroupId = selection.betGroupId;

            this.participantId = selection.participantId;
            this.subCategoryId = selection.subCategoryId;
            this.categoryId = selection.categoryId;
            this.regionId = selection.regionId;

            this.id = selection.id;
            this.name = selection.name;
            this.odds = selection.odds;
            this.sortOrder = selection.sortOrder;
            this.isDisabled = selection.isDisabled;
            this.isOnHold = selection.isOnHold;
        }

        SelectionModel.prototype.getParent = function () {
            return repositories.get("markets").resourcesById[this.marketId];
        };

        SelectionModel.prototype.getSiblings = function () {
            var self = this;
            return _.filter(self.getParent().selections, function (s) {
                return s.id !== self.id;
            });
        };

        return SelectionModel;
    }]);

}(window.angular));
