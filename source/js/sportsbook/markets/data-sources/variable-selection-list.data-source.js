(function (angular) {
    "use strict";

    angular
        .module("sportsbook.markets")
        .factory("variableSelectionListDataSourceFactory", ["lodash", "$q", "baseEventDataSourceFactory", "eventsResource", "applicationState", "queue", "resourceRepository",
            function (_, $q, baseEventDataSourceFactory, eventsResource, applicationState, queue, resourceRepository) {

                function VariableSelectionListDataSource(dataSourceName, dataSourceManager, storageData) {
                    baseEventDataSourceFactory.call(this, dataSourceName);

                    this._dataSourceName = dataSourceName;
                    this._dataSourceManager = dataSourceManager;
                    this._initialStorageData = storageData;

                    this.content = {};
                }

                VariableSelectionListDataSource.prototype = Object.create(baseEventDataSourceFactory.prototype);


                function addSelection(dataSource, selection) {
                    var sortOrder = _.chain(dataSource.content).keys().value().length + 1;
                    selection.betslipOrder = sortOrder;
                    dataSource.content[selection.marketId] = selection;
                    return true;
                }

                VariableSelectionListDataSource.prototype.initialiseEvents = function () {};

                VariableSelectionListDataSource.prototype.processNewEvents = function () {};

                VariableSelectionListDataSource.prototype.processUpdatedEvents = function () {};

                VariableSelectionListDataSource.prototype.processDeletedEvents = function (deletedEvents) {
                    var self = this;
                    if (_.isEmpty(deletedEvents)) {
                        throw new Error("VariableSelectionListDataSource#processDeletedEvents: deletedEvents was not a valid dictionary of events");
                    }

                    var deletedEventIds = _.chain(deletedEvents).pluck("id").uniq().value();
                    var isDeletedEventSelection = function (selection) {
                        return _.contains(deletedEventIds, selection.eventId);
                    };

                    _.remove(self.content, isDeletedEventSelection);
                };

                VariableSelectionListDataSource.prototype.processUpdatedMarkets = function () {};

                VariableSelectionListDataSource.prototype.initialiseMarkets = function (markets) {
                    var self = this;
                    if (self._initialStorageData) {

                        if (_.isEmpty(markets)) {
                            throw new Error("VariableSelectionListDataSource#initialiseMarkets: markets was not a valid dictionary of markets");
                        }

                        _.forEach(markets, function (market) {
                            var storageDataEvent = self._initialStorageData[market.eventId];

                            if (storageDataEvent) {
                                var storageDataMarket = storageDataEvent.markets[market.id];
                                if (storageDataMarket) {
                                    _.some(market.getSelections(), function (selection) {
                                        if (storageDataMarket.selections[selection.id]) {
                                            selection.betslipOrder = storageDataMarket.betslipOrder;
                                            self.content[market.id] = selection;
                                            return true;
                                        }
                                    });
                                }
                            }
                        });

                        self._initialStorageData = null;
                    }
                };

                VariableSelectionListDataSource.prototype.processNewMarkets = function () {};

                VariableSelectionListDataSource.prototype.processDeletedMarkets = function (deletedMarkets) {
                    var self = this;
                    if (_.isEmpty(deletedMarkets)) {
                        throw new Error("VariableSelectionListDataSource#processDeletedMarkets: deletedMarkets was not a valid dictionary of markets");
                    }

                    var deletedMarketIds = _.chain(deletedMarkets).pluck("id").uniq().value();

                    _.forEach(deletedMarketIds, function (deletedMarketId) {
                        delete self.content[deletedMarketId];
                    });
                };

                VariableSelectionListDataSource.prototype.toJSON = function () {
                    var self = this;
                    var storageDataEvents = {};

                    _.forEach(self.content, function (selection) {
                        var selectionId = selection.id;
                        var sortOrder = selection.betslipOrder;
                        var marketId = selection.marketId;
                        var eventId = selection.eventId;

                        if (!storageDataEvents[eventId]) {
                            storageDataEvents[eventId] = {
                                markets: {}
                            };
                        }

                        var storageDataMarkets = storageDataEvents[eventId].markets;

                        if (!storageDataMarkets[marketId]) {
                            storageDataMarkets[marketId] = {
                                selections: {},
                                betGroupId: selection.betGroupId,
                                betslipOrder: sortOrder
                            };
                        }

                        var storageDataSelections = storageDataMarkets[marketId].selections;

                        storageDataSelections[selectionId] = true;
                    });

                    return storageDataEvents;
                };

                VariableSelectionListDataSource.prototype.addSelection = function (selection) {
                    var self = this;
                    var isAdded = !self.content[selection.marketId];
                    addSelection(self, selection);
                    return isAdded;
                };

                function removeSelection(dataSource, selection) {
                    var selectionRemoved = !_.isUndefined(dataSource.content[selection.marketId]);

                    delete dataSource.content[selection.marketId];

                    var ordered = _.chain(dataSource.content).values().sortByOrder("betslipOrder", "asc").value();

                    // Consolidate sort order
                    _.forEach(ordered, function (item, index) {
                        item.betslipOrder = index + 1;
                    });

                    var eventId = selection.eventId;

                    resourceRepository.get("markets").removeResourceFromDataSource(dataSource._dataSourceName, selection.marketId);

                    if (!_.any(dataSource.content, function (otherSelection) {
                            return otherSelection.eventId === eventId;
                        })) {
                        resourceRepository.get("events").removeResourceFromDataSource(dataSource._dataSourceName, selection.eventId);
                    }

                    return selectionRemoved;
                }

                VariableSelectionListDataSource.prototype.removeSelection = function (selection) {
                    var self = this;
                    return removeSelection(self, selection);
                };

                VariableSelectionListDataSource.prototype.clear = function () {
                    var self = this;
                    _.forEach(self.content, function (selection) {
                        removeSelection(self, selection);
                    });
                };

                VariableSelectionListDataSource.prototype.eventsSource = function (isFirstRequest) {
                    var self = this;
                    var eventIds;
                    var betGroupIds;


                    if (!_.isEmpty(self._initialStorageData)) {
                        eventIds = _.keys(self._initialStorageData);
                        betGroupIds = _.chain(self._initialStorageData).values().map("markets").map(function (obj) {
                            return _.values(obj);
                        }).flatten().map("betGroupId").unique().value();
                    } else {
                        eventIds = _.uniq(_.map(this.content, function (selection) {
                            return selection.eventId;
                        }));

                        betGroupIds = _.uniq(_.map(this.content, function (selection) {
                            return selection.betGroupId;
                        }));
                    }

                    if (eventIds.length > 0 && betGroupIds.length > 0) {

                        return applicationState.culture().then(function (culture) {

                            var filters = {
                                "eventIds": eventIds.join(),
                                "betGroupIds": betGroupIds.join()
                            };

                            filters.include = "scoreboard";

                            if (isFirstRequest) {
                                return eventsResource.query(filters, culture, false);
                            } else {
                                // query without a loading bar
                                return eventsResource.query(filters, culture, true);
                            }
                        }).then(function (events) {
                            if (events.length === 0) {
                                self._initialStorageData = null;
                            }

                            return events;
                        });
                    } else {
                        self._initialStorageData = null;
                        return $q.when([]);
                    }
                };

                return VariableSelectionListDataSource;
            }
        ]);

}(window.angular));
