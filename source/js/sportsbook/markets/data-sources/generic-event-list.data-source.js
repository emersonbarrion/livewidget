(function (angular) {
    "use strict";

    angular.module("sportsbook.markets").factory("genericEventListDataSourceFactory", ["baseEventDataSourceFactory", "eventsResource", "applicationState", "eventPhases", "eventSortFields", function (baseEventDataSourceFactory, eventsResource, applicationState, eventPhases, eventSortFields) {
        function GenericEventListDataSourceFactory(dataSourceName, dataSourceManager, filters) {
            baseEventDataSourceFactory.call(this, dataSourceName);

            this._dataSourceManager = dataSourceManager;
            this._filters = angular.copy(filters);

            this.content = [];
        }

        GenericEventListDataSourceFactory.prototype = Object.create(baseEventDataSourceFactory.prototype);

        GenericEventListDataSourceFactory.prototype.initialiseEvents = function (events) {
            this.content = events;
        };

        GenericEventListDataSourceFactory.prototype.processNewEvents = function (events) {
            this.content = _.union(this.content, events);
        };

        GenericEventListDataSourceFactory.prototype.processUpdatedEvents = function () {};

        GenericEventListDataSourceFactory.prototype.processDeletedEvents = function () {};

        GenericEventListDataSourceFactory.prototype.initialiseMarkets = function () {};

        GenericEventListDataSourceFactory.prototype.processUpdatedMarkets = function () {};

        GenericEventListDataSourceFactory.prototype.processNewMarkets = function () {};

        GenericEventListDataSourceFactory.prototype.processDeletedMarkets = function () {};

        function formatDateFilter(date) {
            return (date) ? moment(date).utc().format("YYYY-MM-DDTHH:mm:00") : null;
        }

        GenericEventListDataSourceFactory.prototype.eventsSource = function (isFirstRequest) {
            var self = this;

            return applicationState.culture().then(function (culture) {

                var args = {
                    "eventIds": (self._filters.eventIds) ? self._filters.eventIds.join() : null,
                    "betGroupIds": (!_.isEmpty(self._filters.betGroupIds)) ? self._filters.betGroupIds.join() : null,
                    "eventCount": self._filters.eventCount || null,
                    "eventSortBy": self._filters.eventSortBy || eventSortFields.POPULARITY,
                    "eventPhase": self._filters.phase || eventPhases.BOTH,
                    "eventStartFrom": formatDateFilter(self._filters.eventStartFrom),
                    "eventStartTo": formatDateFilter(self._filters.eventStartTo),
                    "onlyEvenLineMarkets": self._filters.onlyEvenLineMarkets || false
                };

                if (_.isEmpty(self._filters.eventIds) || self._filters.eventIds.length !== 1) {
                    args.categoryIds = (self._filters.categoryIds) ? self._filters.categoryIds.join() : null;
                    args.regionIds = (self._filters.regionIds) ? self._filters.regionIds.join() : null;
                    args.subCategoryIds = (self._filters.subCategoryIds) ? self._filters.subCategoryIds.join() : null;
                }

                if (_.contains([eventPhases.BOTH, eventPhases.LIVE], self._filters.phase)) {
                    args.include = "scoreboard";
                }

                if (isFirstRequest) {
                    return eventsResource.query(args, culture, false).then(function (response) {
                        return response;
                    });
                } else {
                    // query without a loading bar
                    return eventsResource.query(args, culture, true).then(function (response) {
                        return response;
                    });
                }
            });
        };

        return GenericEventListDataSourceFactory;
    }]);

}(window.angular));
