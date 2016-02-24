(function (angular) {
    "use strict";

    function BetgroupCompositesAdapterClass($q,
                                            applicationState,
                                            eventsResource,
                                            catalogueService,
                                            eventDataSourceManagerConfiguration,
                                            $log) {
        this.applicationState = applicationState;
        this.eventsResource = eventsResource;
        this.$q = $q;
        this.catalogueService = catalogueService;
        this.eventDataSourceManagerConfiguration = eventDataSourceManagerConfiguration;
        this.$log = $log;
    }

    BetgroupCompositesAdapterClass.prototype.toViewModel = function (events, columnConfiguration) {
        var self = this;

        if (_.isUndefined(columnConfiguration)) {
            self.$log.error("Column Configuration not supplied!");
        }

        return self.catalogueService.getEventMap()
            .then(function (eventMap) {
                return {
                    headers: self._transformHeaders(columnConfiguration),
                    eventRows: self._transformEventRows(events, columnConfiguration, eventMap)
                };
            });
    };

    BetgroupCompositesAdapterClass.prototype._transformHeaders = function (compositeColumns) {
        var compositeHeaders = [];
        _.forEach(compositeColumns, function (composite) {
            var compositeHeader = {
                name: composite.header,
                selectionHeaders: [],
                betGroupId: composite.possibleBetGroupIds[0]
            };

            _.forEach(composite.columns, function (column) {
                compositeHeader.selectionHeaders.push({
                    name: column.header
                });
            });

            compositeHeaders.push(compositeHeader);
        });

        return compositeHeaders;
    };

    BetgroupCompositesAdapterClass.prototype._transformEventRows = function (events, compositeColumns, eventMap) {
        var self = this;
        return _.compact(_.map(events, function (apiEvent) {
            return self._apiEventToEventRowMapping(apiEvent, compositeColumns, eventMap);
        }), _.isNull);
    };

    BetgroupCompositesAdapterClass.prototype._apiEventToEventRowMapping = function (apiEvent, compositeColumns, eventMap) {
        var self = this;
        var marketCells = [];

        var subCategoryId = apiEvent.subCategory.id;
        var catalogueEvent = _.find(eventMap, {
            "competition": {
                "id": subCategoryId
            }
        });

        if (_.isEmpty(catalogueEvent)) {
            return null;
        }

        _.forEach(compositeColumns, function (composite) {
            //find market
            var allMarkets = apiEvent.getMarkets();
            var apiMarket = _.find(allMarkets, function (market) {
                return _.some(composite.possibleBetGroupIds, function (bgi) {
                    return bgi === market.betGroup.id;
                });
            });

            var market = self._createMarketModel(apiMarket, composite);

            marketCells.push(market);
        });

        return self._createEventModel(apiEvent, catalogueEvent, marketCells);
    };

    BetgroupCompositesAdapterClass.prototype._joinMarkets = function (marketCollection, newMarketCollection) {
        var joinedMarkets = [];

        _.forEach(marketCollection, function (currMarket) {
            var newMarket = _.find(newMarketCollection, function (market) {
                return market.betGroup.id === currMarket.betGroup.id;
            });

            if (newMarket) {
                joinedMarkets.push(newMarket);
            } else {
                joinedMarkets.push(currMarket);
            }
        });

        return joinedMarkets;
    };

    BetgroupCompositesAdapterClass.prototype._createMarketModel = function (apiMarket, composite) {
        var self = this;

        var market = self._apiMarketToMarket(apiMarket, composite.possibleBetGroupIds[0]);

        var index = 0;
        _.forEach(composite.columns, function (column) {
            var marketSelection = self._apiMarketToMarketSelection(apiMarket, column, index);

            if (!market.isEmpty && !(_.isUndefined(marketSelection) || _.isNull(marketSelection))) {
                market.selections.push(marketSelection);
            }

            index++;
        });

        return market;
    };

    BetgroupCompositesAdapterClass.prototype._createEventModel = function (apiEvent, catalogueEvent, marketCells) {
        var getExternalId = function (entity) {
            return entity.externalId;
        };

        var getStatisticsId = function (targetEvent) {
            return _.chain(targetEvent.streams)
                .filter(function (stream) {
                    return stream.type === 3 && stream.provider === 3;
                })
                .pluck('id')
                .first()
                .parseInt()
                .value();
        };

        return {
            id: apiEvent.id,
            name: apiEvent.name,
            liveEvent: apiEvent.liveEvent,
            eventPhase: apiEvent.eventPhase,
            liveStream: apiEvent.liveStream,
            showStats: false,
            statistics: {},
            statisticsId: getStatisticsId(apiEvent),
            hasStats: !!(getExternalId(catalogueEvent.competition) || _.any(apiEvent.participants, getExternalId)),
            startDateTime: apiEvent.startDateTime,
            categoryNode: catalogueEvent.category,
            regionNode: catalogueEvent.region,
            competitionNode: catalogueEvent.competition,
            marketCount: apiEvent.marketCount,
            slug: [apiEvent.isLive ? catalogueEvent.competition.liveSlug : catalogueEvent.competition.slug, apiEvent.shortName].join("/"),
            participants: apiEvent.participants,
            scoreboard: apiEvent.scoreboard,
            streams: apiEvent.streams,
            marketCells: marketCells,
            popularityRank: apiEvent.sortRank.popularityRank,
            originalEvent: apiEvent
        };
    };

    BetgroupCompositesAdapterClass.prototype._apiMarketToMarket = function (apiMarket, betGroupDefaultId) {
        if (!_.isUndefined(apiMarket)) {
            return {
                id: apiMarket.id,
                isEmpty: false,
                selections: [],
                lineValue: apiMarket.lineValue,
                originalMarket: apiMarket,
                header: {
                    betGroupId: apiMarket.betGroup.id
                },
                eventId: apiMarket.eventId
            };
        }

        return {
            isEmpty: true,
            cells: 0,
            lineValue: null,
            selections: [],
            originalMarket: null,
            header: {
                betGroupId: betGroupDefaultId
            }
        };
    };

    BetgroupCompositesAdapterClass.prototype._apiMarketToMarketSelection = function (apiMarket, configColumn, index) {
        var self = this;

        var marketSelection = {
            isEmpty: true,
            isDisabled: true,
            sortOrder: index
        };

        if (apiMarket) {
            if (!configColumn.isLine) {
                var sortOrder = configColumn.selectionsOrderingByBetGroupId[apiMarket.betGroup.id];
                var selection = _.find(apiMarket.selections, _.matchesProperty("sortOrder", sortOrder));

                if (!_.isUndefined(selection)) {
                    marketSelection = self._createSelectionModel(apiMarket, selection, index);
                }
            } else {
                return null;
            }
        }

        return marketSelection;
    };

    BetgroupCompositesAdapterClass.prototype._createSelectionModel = function (apiMarket, selection, index) {
        selection.sortOrder = index > selection.sortOrder ? index : selection.sortOrder;
        return selection;
    };

    BetgroupCompositesAdapterClass.prototype.connectViewmodelToDataSource = function (scope, collection, dataSourceName, adaptationConfig) {
        var self = this;

        if (_.isUndefined(adaptationConfig)) {
            self.$log.error("Adaptation Config not supplied!");
        }

        this.registerEventsAddedListener(scope, collection, dataSourceName, adaptationConfig);
        this.registerEventsUpdatedListener(scope, collection, dataSourceName, adaptationConfig);
        this.registerEventsDeletedListener(scope, collection, dataSourceName, adaptationConfig);

        this.registerMarketsAddedListener(scope, collection, dataSourceName, adaptationConfig);
        this.registerMarketsUpdatedListener(scope, collection, dataSourceName, adaptationConfig);
        this.registerMarketsDeletedListener(scope, collection, dataSourceName, adaptationConfig);
    };

    BetgroupCompositesAdapterClass.prototype.registerEventsAddedListener = function (scope, collection, dataSourceName, adaptationConifg) {
        var self = this;

        scope.$on(dataSourceName + "-added", function (event, newEvents) {
            self.toViewModel(newEvents, adaptationConifg).then(function (newVm) {
                Array.prototype.push.apply(collection.eventRows, newVm.eventRows);
            });
        });
    };

    BetgroupCompositesAdapterClass.prototype.registerEventsUpdatedListener = function (scope, collection, dataSourceName, adaptationConfig) {
        var self = this;

        scope.$on(dataSourceName + "-updated", function (event, eventDiffs) {
            _.forEach(eventDiffs, function (eventDiff) {

                var eventRow = collection.eventRows.find(function (existingEvent) {
                    return existingEvent.id === eventDiff.id;
                });

                if (_.isUndefined(eventRow)) {
                    logger.warn(self.constructor.name + ".registerEventsUpdatedListener: Could not find event row with ID '" + eventDiff.id + "' to update.");
                    return;
                }

                if (!_.isUndefined(eventDiff.newMarketCount)) {
                    eventRow.marketCount = eventDiff.newMarketCount;
                }
            });
        });
    };

    BetgroupCompositesAdapterClass.prototype.registerEventsDeletedListener = function (scope, collection, dataSourceName, adaptationConfig) {
        scope.$on(dataSourceName + "-deleted", function (event, removedEvents) {
            var removedEventIds = _.chain(removedEvents).pluck("id").uniq().value();
            var isRemovedEventRow = function (row) {
                return _.includes(removedEventIds, row.id);
            };

            _.remove(collection.eventRows, isRemovedEventRow);
        });
    };

    BetgroupCompositesAdapterClass.prototype.registerMarketsDeletedListener = function (scope, collection, dataSourceName, adaptationConfig) {
        var self = this;

        scope.$on(dataSourceName + "-markets-deleted", function (event, removedMarkets) {
            var removedMarketIds = _.chain(removedMarkets).pluck("id").uniq().value();

            _.forEach(collection.eventRows, function (evnt) {
                _.remove(evnt.marketCells, function (mrktCell) {
                    return _.some(removedMarketIds, function (id) {
                        return id === mrktCell.id;
                    });
                });
            });
        });
    };

    BetgroupCompositesAdapterClass.prototype.registerMarketsAddedListener = function (scope, collection, dataSourceName, adaptationConfig) {
        var self = this;

        scope.$on(self.eventDataSourceManagerConfiguration.getMarketsAddedBroadcast(dataSourceName), function (event, markets) {
            self._mergeNewMarkets(adaptationConfig, markets, collection.eventRows);
        });
    };

    BetgroupCompositesAdapterClass.prototype.registerMarketsUpdatedListener = function (scope, collection, dataSourceName, adaptationConfig) {
        var self = this;

        scope.$on(dataSourceName + "-markets-updated", function (event, marketDiffs) {
            var eventsWithOnHoldUpdated = {};

            _.forEach(marketDiffs, function (marketDiff) {
                if (!_.isUndefined(marketDiff.newIsOnHold)) {
                    eventsWithOnHoldUpdated[marketDiff.eventId] = true;
                }
            });

            _.forEach(collection.eventRows, function (eventRow) {
                if (eventsWithOnHoldUpdated[eventRow.id]) {
                    self.updateOnHold(eventRow);
                }
            });
        });
    };

    BetgroupCompositesAdapterClass.prototype.updateOnHold = function (eventRow) {
        eventRow.hasOnHoldMarkets = _.any(eventRow.marketCells, function (marketCell) {
            return marketCell.originalMarket && marketCell.originalMarket.isOnHold;
        });
    };

    BetgroupCompositesAdapterClass.prototype._mergeNewMarkets = function (adaptationConfig, markets, eventRows) {
        var self = this;

        var validMarkets = self._getValidMarketsForUpdate(adaptationConfig, markets);

        _.forEach(eventRows, function (evt) {
            var hasOnHoldMarkets = false;

            _.forEach(validMarkets, function (newMkt) {
                if (newMkt.market.eventId === evt.id) {
                    var insertOrReplace = 1;
                    if (!evt.marketCells[newMkt.index]) {
                        insertOrReplace = 0;
                    }

                    evt.marketCells.splice(newMkt.index, insertOrReplace,
                        self._createMarketModel(newMkt.market, adaptationConfig[newMkt.index]));

                    if (newMkt.isOnHold) {
                        hasOnHoldMarkets = true;
                    }
                }
            });

            evt.hasOnHoldMarkets = hasOnHoldMarkets ? hasOnHoldMarkets : evt.hasOnHoldMarkets;
        });
    };

    BetgroupCompositesAdapterClass.prototype._getValidMarketsForUpdate = function (compositeColumns, markets) {
        var validMarkets = [];

        var index = 0;
        _.forEach(compositeColumns, function (composite) {
            var valid = _.find(markets, function (mrkt) {
                var exists = _.some(composite.possibleBetGroupIds, function (bgi) {
                    return bgi === mrkt.betGroup.id;
                });
                return exists;
            });

            if (valid) {
                validMarkets.push({
                    market: valid,
                    index: index
                });
            }

            index++;
        });

        return validMarkets;
    };

    BetgroupCompositesAdapterClass.prototype.overrideViewModel = function (target, source) {
        target.eventRows.length = 0;
        target.eventRows.push.apply(target.eventRows, source.eventRows);
    };

    angular.module("sportsbook.markets")
        .factory("betGroupCompositeViewModelAdapter", [
            "$q",
            "applicationState",
            "eventsResource",
            "catalogueService",
            "eventDataSourceManagerConfiguration",
            "$log",
            function ($q, applicationState, eventsResource,
                      catalogueService, eventDataSourceManagerConfiguration, $log) {
                return new BetgroupCompositesAdapterClass(
                    $q,
                    applicationState,
                    eventsResource,
                    catalogueService,
                    eventDataSourceManagerConfiguration,
                    $log);
            }]);

})(angular);
