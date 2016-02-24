(function (angular) {
    "use strict";

    //TODO: To be removed after search is updated.
    var EventServiceClass = (function () {
        var dependencies = {};

        function EventServiceClass($http, lodash, apiConfig, eventsResource, catalogueService, applicationState, betGroupsResource, $q, widgetConfigurations) {
            // store the injected dependencies
            dependencies.$q = $q;
            dependencies.$http = $http;
            dependencies.lodash = lodash;
            dependencies.apiConfig = apiConfig;
            dependencies.eventsResource = eventsResource;
            dependencies.catalogueService = catalogueService;
            dependencies.applicationState = applicationState;
            dependencies.betGroupsResource = betGroupsResource;
            dependencies.widgetConfigurations = widgetConfigurations;

        }

        EventServiceClass.$inject = ['$http', 'lodash', 'apiConfig', 'eventsResource', 'catalogueService', 'applicationState', 'betGroupsResource', '$q', "widgetConfigurations"];

        EventServiceClass.prototype._findById = function (options) {

            return dependencies.applicationState.culture().then(function (culture) {
                return dependencies.eventsResource.query({
                    "eventids": options.eventIds.join(),
                    "betGroups": (options.betGroupIds ? options.betGroupIds.join() : undefined),
                    "onlyEvenLineMarkets": false
                }, culture).then(function (event) {
                    return event;
                });
            });
        };

        EventServiceClass.prototype._findByName = function (options) {

            return dependencies.applicationState.culture().then(function (culture) {
                return dependencies.eventsResource.query({
                    "categoryId": options.categoryId,
                    "regionIds": options.regionId,
                    "subCategoryIds": options.competitionId,
                    "betGroups": options.betGroupIds,
                    // "onlyEvenLineMarkets": !_.isUndefined(options.betGroupIds),
                }, culture).then(function (events) {
                    return dependencies.lodash.find(events, function (event) {
                        return event.shortName && event.shortName.endsWith(options.event);
                    });
                });
            });
        };

        /**
         * @ngdoc method
         * @name sportsbook.markets:eventService#getEvent
         * @methodOf sportsbook.markets:eventService
         * @param {object} options - Describes the request.
         * @param {number} options.eventId - If provided, looks up the event by id.
         * @param {number} options.categoryId - The id of the category to request market data for.
         * @param {number} options.regionId - The id of the region to request market data for.
         * @param {number} options.competitionId - The id of the sub category to request market data for.
         * @param {string} options.event - The slug of the event to retrieve
         * @param {array} options.betGroupIds - An array of betgroup ids to return. If omitted, all betgroups are returned.
         * @description Returns the details of an event.
         */
        EventServiceClass.prototype.getEvent = function (options) {
            return !(_.isNull(options.eventIds) || _.isUndefined(options.eventIds)) ? this._findById(options) : this._findByName(options);
        };


        EventServiceClass.prototype.filterAndSortMarkets = function (options) {
            if (dependencies.lodash.isEmpty(options.betGroups)) {
                return options.markets;
            }

            var markets = [];
            var self = this;
            var headerSortOrder = self.getHeaderSortOrder({
                betGroups: options.betGroups
            });

            dependencies.lodash.each(headerSortOrder, function (h) {

                var market = dependencies.lodash.find(options.markets, {
                    "betGroup": {
                        "id": h.id
                    }
                });

                if (market) {
                    market.sortOrder = h.index;
                    markets.push(market);
                } else {
                    markets.push({
                        "betGroup": {
                            "id": h.id
                        },
                        "sortOrder": h.index
                    });
                }
            });

            return dependencies.lodash.sortBy(markets, "sortOrder");
        };
        EventServiceClass.prototype.getHeaderSortOrder = function (options) {
            var headerSortOrder = [];

            if (options.betGroups) {

                var index = 0;
                dependencies.lodash.each(options.betGroups, function (id) {
                    headerSortOrder.push({
                        "id": id,
                        "index": index
                    });

                    index++;
                });
            }

            return headerSortOrder;
        };
        EventServiceClass.prototype.getHeadersForEvent = function (options) {

            var self = this;

            if (dependencies.lodash.isEmpty(options.betGroups)) {
                return dependencies.$q.when([]);
            }

            var headerSortOrder = self.getHeaderSortOrder({
                betGroups: options.betGroups
            });
            var requestIds = options.betGroups.join(",");

            return dependencies.applicationState.culture().then(function (culture) {
                return dependencies.betGroupsResource.query({
                    "ids": requestIds
                }, culture).then(function (betGroups) {
                    dependencies.lodash.forEach(betGroups, function (betGroup) {
                        // Determine the sort order
                        var sortOrderItem = dependencies.lodash.find(headerSortOrder, {
                            "id": betGroup.betGroupId
                        });
                        betGroup.sortOrder = (sortOrderItem) ? sortOrderItem.index : 999;

                        var market = null;

                        var event = dependencies.lodash.find(options.events, function (e) {
                            market = dependencies.lodash.find(e.markets, function (m) {
                                return m.betGroup.id === betGroup.betGroupId && m.selections && m.selections.length > 0;
                            });

                            return market;
                        });


                        if (event) {
                            betGroup.selectionHeaders = dependencies.lodash.map(dependencies.lodash.sortBy(market.selections, "sortOrder"), "name");
                            if (market.lineValue) {
                                betGroup.selectionHeaders.unshift("Line");
                            }
                        } else {
                            betGroup.selectionHeaders = [""];
                        }
                    });

                    return dependencies.lodash.sortBy(betGroups, "sortOrder");
                });
            });
        };
        return EventServiceClass;
    }());

    /**
     * @ngdoc service
     * @name sportsbook.markets:eventService
     * @description markets factory to be consumed by the MarketsProvider
     */
    angular.module('sportsbook.markets')
        .service('eventService', EventServiceClass);

}(window.angular));
