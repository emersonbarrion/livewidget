(function (angular) {
    "use strict";

    angular
        .module("sportsbook.markets")
        .factory("EventTableViewModelAdapter", ["lodash", "applicationState", "catalogueService", "widgetConfigurations", "betGroupsResource", "$q", "$log", "eventDataSourceManagerConfiguration",
            function (_, applicationState, catalogueService, widgetConfigurations, betGroupsResource, $q, logger, eventDataSourceManagerConfiguration) {

                function EventTableViewModelAdapter() {
                    // constructor
                }

                var stringContainsZeroValues = /\b[\D]*[\s]*([0]+)\b/gi;

                EventTableViewModelAdapter.prototype._filterHeaders = function (headers, eventRows, numberOfColumns) {
                    var headerIterator = _.chain(headers)
                        .filter(function (header) {
                            return _.any(eventRows, function (eventRow) {
                                return _.any(eventRow.marketCells, function (marketCell) {
                                    return marketCell.header === header && marketCell.selections && marketCell.selections.length > 0;
                                });
                            });
                        });

                    if (numberOfColumns) {
                        headerIterator = headerIterator.take(numberOfColumns);
                    }

                    return headerIterator.value();
                };

                EventTableViewModelAdapter.prototype._filterMarketsAndEvents = function (eventRows, headers) {
                    var eventsToShow = [];

                    _.forEach(eventRows, function (eventRow) {

                        var shouldShowRow = _.any(eventRow.marketCells, function (marketCell) {
                            return !marketCell.isEmpty;
                        });

                        if (shouldShowRow) {
                            eventRow.marketCells = _.filter(eventRow.marketCells, function (marketCell) {
                                return _.any(headers, function (header) {
                                    return marketCell.header === header;
                                });
                            });

                            var noRows = _.all(eventRow.marketCells, {
                                isEmpty: true
                            });

                            if (noRows) {
                                logger.log(eventRow);
                            }

                            eventsToShow.push(eventRow);
                        }
                    });

                    return eventsToShow;
                };

                EventTableViewModelAdapter.prototype._getHeaderSortOrder = function (options) {
                    var self = this;

                    var headerSortOrder = [];

                    if (options.betGroups) {

                        var index = 0;
                        _.each(options.betGroups, function (id) {
                            headerSortOrder.push({
                                "id": id,
                                "index": index
                            });

                            index++;
                        });
                    }

                    return headerSortOrder;
                };

                EventTableViewModelAdapter.prototype._getHeadersForEvents = function (options) {
                    var self = this;

                    if (_.isEmpty(options.betGroups)) {
                        logger.warn("options.betGroups was empty");
                        return [];
                    }

                    var headerSortOrder = self._getHeaderSortOrder({
                        betGroups: options.betGroups
                    });

                    var allSelectionsByBetGroup = _.chain(options.events).map(function (e) {
                        return e.getMarkets();
                    }).flatten().map(function (m) {
                        var map = {
                            "betGroupId": m.betGroup.id,
                            "selections": m.selections
                        };

                        return map;
                    }).flatten().value();

                    // Build a dictionary of all the selection names available for a given bet group.
                    // This allows us to set up the headers even if some markets may not have all their
                    // selections.
                    var headerSelections = {};

                    _.forEach(options.betGroups, function (betGroup) {

                        var definitionsForBetGroup = _.filter(allSelectionsByBetGroup, {
                            betGroupId: betGroup
                        });

                        // Iterate the definitions, making sure we collect every available selection name

                        headerSelections[betGroup] = _.chain(definitionsForBetGroup).pluck("selections").flatten(true).map(function (s) {

                            return {
                                "name": s.name,
                                "sortOrder": s.sortOrder,
                                "isLine": false // We don't need this here, but we'll just add it here instead of adding it later.
                            };
                        }).flatten(true).uniq("sortOrder").sortBy("sortOrder").value();
                    });

                    // Extract markets and betgroups from events.
                    var result = [];

                    _.forEach(options.betGroups, function (betGroup) {
                        // Determine the sort order
                        var market = null;

                        var event = _.find(options.events, function (e) {
                            market = _.find(e.getMarkets(), function (m) {
                                return m.betGroup.id === betGroup && m.getSelections() && m.getSelections().length > 0 && _.all(m.selections, function (selection) {
                                    return selection.name;
                                });
                            });

                            return market;
                        });

                        if (market) {
                            var item = {
                                "betGroupId": market.betGroup.id,
                                "name": market.betGroup.name // remove placeholders for multi-event table
                            };

                            var sortOrderItem = _.find(headerSortOrder, {
                                "id": betGroup
                            });

                            item.sortOrder = (sortOrderItem) ? sortOrderItem.index : 999;

                            item.selectionHeaders = headerSelections[market.betGroup.id];

                            if (market.lineValue) {
                                item.selectionHeaders.unshift({
                                    isLine: true,
                                    sortOrder: -1,
                                    name: "Line"
                                });
                            }

                            result.push(item);
                        }
                    });

                    return _.sortBy(result, "sortOrder");
                };

                EventTableViewModelAdapter.prototype.toEmptyMarketCell = function (header) {
                    return {
                        isEmpty: true,
                        cells: 0,
                        header: header,
                        lineValue: null,
                        selections: [],
                        sortOrder: header.sortOrder,
                        originalMarket: null
                    };
                };

                EventTableViewModelAdapter.prototype.toEmptySelection = function (sortOrder) {
                    return {
                        isDisabled: true,
                        sortOrder: sortOrder,
                        odds: 1
                    };
                };

                EventTableViewModelAdapter.prototype.toMarketCell = function (header, market, configuration) {
                    var lineValue;
                    var self = this;

                    // compare the betGroupId with the id's from the handicapBetGroups to see if
                    // we find any matches
                    if (market.lineValue && configuration && configuration.handicapBetGroups && _.includes(configuration.handicapBetGroups, market.betGroup.id)) {
                        lineValue = market.lineValue.replace(stringContainsZeroValues, '').trim();

                        // We should add a '+' symbol if lineValue it's greater than zero
                        if (lineValue[0] !== "-") {
                            lineValue = "+" + lineValue;
                        }
                    } else {
                        lineValue = market.lineValue;
                    }


                    var selections = market.getSelections();
                    // Run the selections against the header, and pad any missing selections.
                    var selectionCells = _.chain(header.selectionHeaders).filter(function (selectionHeader) {
                        return !selectionHeader.isLine;
                    }).map(function (selectionHeader) {
                        var selectionForHeader = _.filter(selections, {
                            "sortOrder": selectionHeader.sortOrder
                        });

                        return (_.isEmpty(selectionForHeader)) ? self.toEmptySelection(selectionHeader.sortOrder) : selectionForHeader[0];
                    }).flatten().value();

                    return {
                        id: market.id,
                        isEmpty: false,
                        cells: ((market.lineValue) ? 1 : 0) + selectionCells.length,
                        header: header,
                        selections: selectionCells,
                        lineValue: lineValue,
                        sortOrder: header.sortOrder,
                        originalMarket: market
                    };
                };

                EventTableViewModelAdapter.prototype.toMarketCells = function (headers, markets, configuration) {
                    var self = this;

                    var marketCells = [];

                    _.each(headers, function (header) {

                        var market = _.find(markets, {
                            betGroup: {
                                id: header.betGroupId
                            }
                        });

                        if (market) {
                            marketCells.push(self.toMarketCell(header, market, configuration));
                        } else {
                            marketCells.push(self.toEmptyMarketCell(header));
                        }
                    });

                    return _.sortBy(marketCells, "sortOrder");
                };

                EventTableViewModelAdapter.prototype.toEventRows = function (events, options) {
                    var self = this;

                    options = options || {};

                    if (_.isUndefined(options.configurationSection)) {
                        options.configurationSection = (self.isLive) ? "live-competition-section" : "competition-section";
                    }

                    var categoryIds = _.uniq(_.pluck(events, "category.id"));

                    var attachWidgetConfigForCategory = function (configsByCategoryId, categoryId) {
                        configsByCategoryId[categoryId] = $q.all({
                            culture: applicationState.culture(),
                            config: widgetConfigurations.getForSection(categoryId, options.configurationSection)
                        }).then(function (params) {
                            return {
                                categoryId: categoryId,
                                configuration: params.config,
                                headers: self._getHeadersForEvents({
                                    events: events,
                                    culture: params.culture,
                                    betGroups: params.config.betGroups
                                })
                            };
                        });
                        return configsByCategoryId;
                    };

                    return $q.all({
                        eventMap: catalogueService.getEventMap(),
                        widgetConfigsByCategory: $q.all(_.reduce(categoryIds, attachWidgetConfigForCategory, {}))
                    }).then(function (params) {
                        var eventNodeSamplesByCategoryId = {};

                        return _.compact(_.map(events, function (event) {

                            var subCategoryId = event.subCategory.id;
                            eventNodeSamplesByCategoryId[subCategoryId] = eventNodeSamplesByCategoryId[subCategoryId] || _.find(params.eventMap, {
                                "competition": {
                                    "id": subCategoryId
                                }
                            });
                            if (_.isEmpty(eventNodeSamplesByCategoryId[subCategoryId])) {
                                return null;
                            }

                            var categoryNode = eventNodeSamplesByCategoryId[subCategoryId].category;
                            var regionNode = eventNodeSamplesByCategoryId[subCategoryId].region;
                            var competitionNode = eventNodeSamplesByCategoryId[subCategoryId].competition;

                            var categoryConfiguration = params.widgetConfigsByCategory[categoryNode.id];
                            var headers = categoryConfiguration.headers;
                            var configuration = categoryConfiguration.configuration;

                            return self.toEventRow(event, headers, configuration, categoryNode, regionNode, competitionNode);
                        }));
                    });

                };

                EventTableViewModelAdapter.prototype.toEventRow = function (event, headers, configuration, categoryNode, regionNode, competitionNode) {
                    var self = this;

                    var getExternalId = function (entity) {
                        return entity.externalId;
                    };

                    var getStastiticsId = function (targetEvent) {
                        return _.chain(targetEvent.streams)
                            .filter(function (stream) {
                                return stream.type === 3 && stream.provider === 3;
                            })
                            .pluck('id')
                            .first()
                            .parseInt()
                            .value();
                    };

                    var eventRow = {
                        id: event.id,
                        name: event.name,
                        liveEvent: event.liveEvent,
                        eventPhase: event.eventPhase,
                        liveStream: event.liveStream,
                        showStats: false,
                        statistics: {},
                        statisticsId: getStastiticsId(event),
                        hasStats: !!(getExternalId(competitionNode) || _.any(event.participants, getExternalId)),
                        headers: headers,
                        startDateTime: event.startDateTime,
                        configuration: configuration,
                        categoryNode: categoryNode,
                        regionNode: regionNode,
                        competitionNode: competitionNode,
                        marketCount: event.marketCount,
                        slug: [event.isLive ? competitionNode.liveSlug : competitionNode.slug, event.shortName].join("/"),
                        participants: event.participants,
                        scoreboard: event.scoreboard,
                        streams: event.streams,
                        marketCells: self.toMarketCells(headers, event.getMarkets(), configuration),
                        popularityRank: event.sortRank.popularityRank,
                        originalEvent: event
                    };

                    self.updateOnHold(eventRow);

                    return eventRow;
                };

                EventTableViewModelAdapter.prototype.toTable = function (events, options, configuration) {
                    var self = this;

                    if (!events.length) {
                        return null;
                    }

                    var config = events[0].configuration;

                    options = _.defaults(options || {}, {
                        numberOfColumns: null,
                        limit: events[0].configuration.limit
                    });

                    var filteredHeaders = self._filterHeaders(events[0].headers, events, options.numberOfColumns);

                    if (!filteredHeaders) {
                        return null;
                    }

                    var filteredEvents = self._filterMarketsAndEvents(events, filteredHeaders);

                    var maxPopularity = _.chain(filteredEvents).pluck("popularityRank").max().value();
                    var maxStartDateTime = _.chain(filteredEvents).pluck("startDateTime").max().value();
                    var minStartDateTime = _.chain(filteredEvents).pluck("startDateTime").min().value();

                    return {
                        headers: filteredHeaders,
                        eventRows: filteredEvents,
                        configuration: config,
                        limit: options.limit,
                        popularityRank: maxPopularity,
                        maxStartDateTime: maxStartDateTime,
                        minStartDateTime: minStartDateTime
                    };
                };

                EventTableViewModelAdapter.prototype.toViewModel = function (events, options) {
                    var self = this;
                    var table = self.toTable(self.toEventRows(events), options);

                    if (table) {
                        return [table];
                    } else {
                        return table;
                    }
                };

                var fillGapsWithEmptyMarketCells = function (table, correctHeaders, context) {

                    _.forEach(table.eventRows, function (row) {
                        var marketCells = [];
                        _.forEach(correctHeaders, function (header) {

                            var market = _.find(row.marketCells, function (cell) {
                                return cell.header.betGroupId === header.betGroupId;
                            });

                            if (!market) {
                                marketCells.push(context.toEmptyMarketCell(header));
                            } else {
                                marketCells.push(market);
                            }
                        });
                        row.marketCells = _.sortBy(marketCells, "sortOrder");
                        row.headers = correctHeaders;
                    });

                };

                var addItemsToExistingTables = function (tables, events, context, options) {
                    _.forEach(tables, function (table) {

                        if (!table) {
                            return;
                        }

                        // Select any events which apply to this table.
                        var criteria = {};

                        if (table.categoryNode) {
                            criteria.category = {
                                "id": table.categoryNode.id
                            };
                        }

                        if (table.competitionNode) {
                            criteria.subCategory = {
                                "id": table.competitionNode.id
                            };
                        }

                        // Do any of the events match the category we're displaying?
                        var filteredEvents = _.where(events, criteria);

                        if (_.isEmpty(filteredEvents)) {
                            return;
                        }

                        context.toViewModel(filteredEvents, options).then(function (newTables) {
                            if (_.isEmpty(newTables)) {
                                return;
                            }

                            var newTable = newTables[0];
                            var newHeaders = _.chain(_.union(table.headers, newTable.headers))
                                .uniq("betGroupId")
                                .sortBy("sortOrder")
                                .value();

                            // Hacky way to replace the contents of an array without chaning the actual memory address
                            Array.prototype.splice.apply(table.headers, [0, newHeaders.length].concat(newHeaders));

                            // Normalize the two tables
                            fillGapsWithEmptyMarketCells(table, newHeaders, context);
                            fillGapsWithEmptyMarketCells(newTable, newHeaders, context);

                            // Add all the rows of the new table into the view model table
                            _.forEach(newTable.eventRows, function (row) {
                                table.eventRows.push(row);
                            });

                            table.eventRows.sort(function (a, b) {
                                return a.startDateTime - b.startDateTime;
                            });

                        });
                    });
                };

                var addItemsToNewTables = function (tables, events, context, options) {

                    var eventsForNewTables = _.groupBy(events, options.eventGrouping);

                    if (!_.isEmpty(eventsForNewTables)) {
                        _.forEach(eventsForNewTables, function (eventsForTable) {
                            context.toViewModel(eventsForTable, options).then(function (data) {
                                if (_.isEmpty(data)) {
                                    return;
                                }
                                tables.push(data[0]);
                            });
                        });
                    }
                };

                EventTableViewModelAdapter.prototype.updateOnHold = function (eventRow) {
                    eventRow.hasOnHoldMarkets = _.any(eventRow.marketCells, function (marketCell) {

                        return marketCell.originalMarket && marketCell.originalMarket.isOnHold;
                    });
                };

                EventTableViewModelAdapter.prototype.connectViewmodelToDataSource = function (scope, collection, dataSourceName) {
                    this.registerEventsAddedListener(scope, collection, dataSourceName);
                    this.registerEventsUpdatedListener(scope, collection, dataSourceName);
                    this.registerEventsDeletedListener(scope, collection, dataSourceName);

                    this.registerMarketsAddedListener(scope, collection, dataSourceName);
                    this.registerMarketsUpdatedListener(scope, collection, dataSourceName);
                    this.registerMarketsDeletedListener(scope, collection, dataSourceName);
                };

                EventTableViewModelAdapter.prototype.overrideViewModel = function (target, source) {
                    target.length = 0;
                    target.push.apply(target, source);
                };

                EventTableViewModelAdapter.prototype.registerEventsAddedListener = function (scope, collection, dataSourceName, options) {
                    throw new Error("Not implemented");
                };

                EventTableViewModelAdapter.prototype._registerEventsAddedListener = function (scope, collection, dataSourceName, groupings, exists, options) {
                    var self = this;

                    if (_.isUndefined(options)) {
                        options = {};
                    }

                    if (_.isUndefined(options.eventGrouping)) {
                        options.eventGrouping = function (evt) {
                            return evt.category.id;
                        };
                    }

                    scope.$on(dataSourceName + "-added", function (event, newEvents) {

                        var groupingIds = groupings(collection);

                        // Separate existing categories from new ones.
                        var eventOperations = _.groupBy(newEvents, function (evt) {
                            return (exists(groupingIds, evt)) ? "addToExistingTable" : "addToNewTable";
                        });

                        // Create tables for events from new categories.
                        addItemsToNewTables(collection, eventOperations.addToNewTable, self, options);

                        // Process event changes for existing tables.
                        addItemsToExistingTables(collection, eventOperations.addToExistingTable, self, options);
                    });
                };

                EventTableViewModelAdapter.prototype.registerEventsUpdatedListener = function (scope, collection, dataSourceName) {
                    var self = this;

                    scope.$on(dataSourceName + "-updated", function (event, eventDiffs) {

                        _.forEach(eventDiffs, function (eventDiff) {

                            var eventRow = _.chain(collection)
                                .find(function (table) {
                                    return _.any(table.eventRows, {
                                        "id": eventDiff.id
                                    });
                                })
                                .get("eventRows")
                                .find({
                                    "id": eventDiff.id
                                })
                                .value();

                            if (!eventRow) {
                                logger.warn(self.constructor.name + ".registerEventsUpdatedListener: Could not find event row with ID '" + eventDiff.id + "' to update.");
                                return;
                            }

                            if (!_.isUndefined(eventDiff.newMarketCount)) {
                                eventRow.marketCount = eventDiff.newMarketCount;
                            }
                        });
                    });
                };

                EventTableViewModelAdapter.prototype.registerEventsDeletedListener = function (scope, collection, dataSourceName) {
                    scope.$on(dataSourceName + "-deleted", function (event, removedEvents) {
                        var removedEventIds = _.chain(removedEvents).pluck("id").uniq().value();
                        var isRemovedEventRow = function (row) {
                            return _.includes(removedEventIds, row.id);
                        };
                        _.remove(collection, function (item) {
                            _.remove(item.eventRows, isRemovedEventRow);
                            return _.isEmpty(item.eventRows);
                        });
                    });
                };

                EventTableViewModelAdapter.prototype.registerMarketsDeletedListener = function (scope, collection, dataSourceName) {
                    var self = this;

                    scope.$on(dataSourceName + "-markets-deleted", function (event, removedMarkets) {
                        var removedMarketIds = _.chain(removedMarkets).pluck("id").uniq().value();

                        var isRemovedMarketCell = function (cell) {
                            return _.includes(removedMarketIds, cell.id);
                        };

                        var findRemovedCell = function (cells) {
                            return _.find(cells, isRemovedMarketCell);
                        };

                        var findIndexOf = function (cells) {
                            return _.indexOf(cells, findRemovedCell(cells));
                        };

                        _.forEach(collection, function (item) {
                            if (_.isUndefined(item)) {
                                return;
                            }

                            _.forEach(item.eventRows, function (row) {
                                var index = findIndexOf(row.marketCells);
                                while (index > -1) {
                                    var currentCell = row.marketCells[index];
                                    row.marketCells[index] = self.toEmptyMarketCell(currentCell.header);
                                    index = findIndexOf(row.marketCells);
                                    logger.debug("Removed market " + currentCell.id + " from event " + row.id);
                                }
                                self.updateOnHold(row);
                            });
                        });
                    });
                };

                EventTableViewModelAdapter.prototype.registerMarketsAddedListener = function (scope, collection, dataSourceName) {
                    var self = this;

                    scope.$on(eventDataSourceManagerConfiguration.getMarketsAddedBroadcast(dataSourceName), function (event, markets) {

                        _.forEach(collection, function (item) {

                            if (_.isUndefined(item)) {
                                return;
                            }

                            // Find the events to which the market applies
                            _.forEach(markets, function (market) {

                                var eventForMarket = _.find(item.eventRows, {
                                    "id": market.eventId
                                });

                                if (_.isUndefined(eventForMarket)) {
                                    return;
                                }

                                var columnForMarket = _.find(eventForMarket.marketCells, {
                                    "header": {
                                        "betGroupId": market.betGroup.id
                                    }
                                });

                                if (_.isUndefined(columnForMarket)) {
                                    logger.debug("Tried to add market " + market.id + " to event " + market.eventId + " but failed as the event does not have a column for betGroup " + market.betGroup.id);
                                    return;
                                }

                                var index = _.indexOf(eventForMarket.marketCells, columnForMarket);
                                eventForMarket.marketCells[index] = EventTableViewModelAdapter.prototype.toMarketCell(columnForMarket.header, market, item.configuration);

                                logger.debug("Added market " + market.id + " to event " + market.eventId);
                                self.updateOnHold(eventForMarket);
                            });
                        });
                    });
                };

                EventTableViewModelAdapter.prototype.registerMarketsUpdatedListener = function (scope, collection, dataSourceName) {
                    var self = this;

                    scope.$on(dataSourceName + "-markets-updated", function (event, marketDiffs) {
                        var eventsWithOnHoldUpdated = {};

                        _.forEach(marketDiffs, function (marketDiff) {
                            if (!_.isUndefined(marketDiff.newIsOnHold)) {
                                eventsWithOnHoldUpdated[marketDiff.eventId] = true;
                            }
                        });

                        _.forEach(collection, function (item) {

                            if (_.isUndefined(item)) {
                                return;
                            }

                            _.forEach(item.eventRows, function (eventRow) {
                                if (eventsWithOnHoldUpdated[eventRow.id]) {
                                    self.updateOnHold(eventRow);
                                }
                            });
                        });
                    });
                };

                return EventTableViewModelAdapter;
            }
        ]);

    angular
        .module("sportsbook.markets")
        .factory("eventTableViewModelAdapterByCompetition", ["lodash", "EventTableViewModelAdapter", function (_, EventTableViewModelAdapter) {

            function EventTableViewModelAdapterByCompetition() {
                // constructor
                EventTableViewModelAdapter.call(this);
            }

            EventTableViewModelAdapterByCompetition.prototype = Object.create(EventTableViewModelAdapter.prototype);
            EventTableViewModelAdapterByCompetition.prototype.constructor = EventTableViewModelAdapterByCompetition;

            EventTableViewModelAdapterByCompetition.prototype.groupEvents = function (transformedEvents) {
                return _.groupBy(transformedEvents, "competitionNode.id");
            };

            EventTableViewModelAdapterByCompetition.prototype.toTable = function (eventsByCompetition, options) {
                var eventTableViewModel = EventTableViewModelAdapter.prototype.toTable.call(this, eventsByCompetition, options);
                return _.merge(eventTableViewModel, {
                    competitionNode: eventsByCompetition[0].competitionNode,
                });
            };

            EventTableViewModelAdapterByCompetition.prototype.toViewModel = function (events, options) {
                var self = this;

                var toCompetitionTable = function (competitionEvents) {
                    return self.toTable(competitionEvents, options);
                };

                return self.toEventRows(events).then(function (transformedEvents) {
                    var groupedEvents = self.groupEvents(transformedEvents);
                    return _.chain(groupedEvents)
                        .map(toCompetitionTable)
                        .compact()
                        .value();
                });
            };

            EventTableViewModelAdapterByCompetition.prototype.registerEventsAddedListener = function (scope, collection, dataSourceName, options) {
                var self = this;

                var groupings = function (tables) {
                    return _.chain(tables).pluck("competitionNode").pluck("id").uniq().value();
                };

                var eventGrouping = function (evt) {
                    return evt.subCategory.id;
                };

                var exists = function (groupingIds, evt) {
                    return _.contains(groupingIds, evt.subCategory.id);
                };

                options = options || {};
                options.eventGrouping = eventGrouping;

                EventTableViewModelAdapter.prototype._registerEventsAddedListener.call(self, scope, collection, dataSourceName, groupings, exists, options);
            };

            return new EventTableViewModelAdapterByCompetition();
        }]);

    angular
        .module("sportsbook.markets")
        .factory("eventTableViewModelAdapterByCategory", ["lodash", "EventTableViewModelAdapter", function (_, EventTableViewModelAdapter) {

            function EventTableViewModelAdapterByCategory() {
                // constructor
                EventTableViewModelAdapter.call(this);
            }

            EventTableViewModelAdapterByCategory.prototype = Object.create(EventTableViewModelAdapter.prototype);
            EventTableViewModelAdapterByCategory.prototype.constructor = EventTableViewModelAdapterByCategory;

            EventTableViewModelAdapterByCategory.prototype.groupEvents = function (transformedEvents) {
                return _.groupBy(transformedEvents, "categoryNode.id");
            };

            EventTableViewModelAdapterByCategory.prototype.toTable = function (eventsByCategory, options) {
                var eventTableViewModel = EventTableViewModelAdapter.prototype.toTable.call(this, eventsByCategory, options);
                return _.merge(eventTableViewModel, {
                    categoryNode: eventsByCategory[0].categoryNode,
                });
            };

            EventTableViewModelAdapterByCategory.prototype.toViewModel = function (events, options) {
                var self = this;

                var toCategoryTable = function (categoryEvents) {
                    return self.toTable(categoryEvents, options);
                };

                return self.toEventRows(events).then(function (transformedEvents) {
                    var groupedEvents = self.groupEvents(transformedEvents);
                    return _.chain(groupedEvents)
                        .map(toCategoryTable)
                        .compact()
                        .value();
                });
            };

            EventTableViewModelAdapterByCategory.prototype.registerEventsAddedListener = function (scope, collection, dataSourceName, options) {

                var self = this;

                var groupings = function (tables) {
                    return _.chain(tables).pluck("categoryNode").pluck("id").uniq().value();
                };

                var exists = function (groupingIds, evt) {
                    return _.contains(groupingIds, evt.category.id);
                };

                EventTableViewModelAdapter.prototype._registerEventsAddedListener.call(self, scope, collection, dataSourceName, groupings, exists, options);
            };

            return new EventTableViewModelAdapterByCategory();

        }]);

    angular
        .module("sportsbook.markets")
        .factory("startingSoonViewModelAdapter", ["lodash", "EventTableViewModelAdapter", "applicationState", "betGroupsResource", function (_, EventTableViewModelAdapter, applicationState, betGroupsResource) {

            //This proxy allows us to change the selections to fit into 
            //the one betgroup view we want for the starting soon widget
            //without affecting the underlying selection in the repository.
            function StartingSoonSelectionProxy(selectionModel, isLastSelection) {
                var self = this;
                self._selection = selectionModel;

                if (isLastSelection) {
                    Object.defineProperty(self, "sortOrder", {
                        value: 3
                    });
                } else {
                    Object.defineProperty(self, "sortOrder", {
                        get: function () {
                            return self._selection.sortOrder;
                        }
                    });
                }


                Object.defineProperty(self, "marketId", {
                    get: function () {
                        return self._selection.marketId;
                    }
                });

                Object.defineProperty(self, "eventId", {
                    get: function () {
                        return self._selection.eventId;
                    }
                });

                Object.defineProperty(self, "marketName", {
                    get: function () {
                        return self._selection.marketName;
                    }
                });

                Object.defineProperty(self, "eventName", {
                    get: function () {
                        return self._selection.eventName;
                    }
                });

                Object.defineProperty(self, "ruleId", {
                    get: function () {
                        return self._selection.ruleId;
                    }
                });

                Object.defineProperty(self, "isLive", {
                    get: function () {
                        return self._selection.isLive;
                    }
                });

                Object.defineProperty(self, "betGroupId", {
                    get: function () {
                        return self._selection.betGroupId;
                    }
                });

                Object.defineProperty(self, "participantId", {
                    get: function () {
                        return self._selection.participantId;
                    }
                });

                Object.defineProperty(self, "subCategoryId", {
                    get: function () {
                        return self._selection.subCategoryId;
                    }
                });

                Object.defineProperty(self, "categoryId", {
                    get: function () {
                        return self._selection.regionId;
                    }
                });

                Object.defineProperty(self, "id", {
                    get: function () {
                        return self._selection.id;
                    }
                });

                Object.defineProperty(self, "name", {
                    get: function () {
                        return self._selection.name;
                    }
                });

                Object.defineProperty(self, "odds", {
                    get: function () {
                        return self._selection.odds;
                    }
                });

                Object.defineProperty(self, "isDisabled", {
                    get: function () {
                        return self._selection.isDisabled;
                    }
                });

                Object.defineProperty(self, "isOnHold", {
                    get: function () {
                        return self._selection.isOnHold;
                    }
                });
            }

            StartingSoonSelectionProxy.prototype.getParent = function () {
                return this._selection.getParent.call(this._selection, arguments);
            };

            StartingSoonSelectionProxy.prototype.getSiblings = function () {
                return this._selection.getSiblings.call(this._selection, arguments);
            };

            function StartingSoonViewModelAdapter() {
                // constructor
                EventTableViewModelAdapter.call(this);
            }

            StartingSoonViewModelAdapter.prototype = Object.create(EventTableViewModelAdapter.prototype);
            StartingSoonViewModelAdapter.prototype.constructor = StartingSoonViewModelAdapter;

            StartingSoonViewModelAdapter.prototype.toTable = function (events, options, configuration) {
                var self = this;
                if (!events.length) {
                    return null;
                }

                var config = events[0].configuration;

                options = _.defaults(options || {}, {
                    numberOfColumns: null,
                    limit: events[0].configuration.limit
                });

                return applicationState.culture().then(function (culture) {
                    return betGroupsResource.query({
                        "ids": 1 // retrieve betgroup id: 1
                    }, culture).then(function (betGroups) {
                        var header = [{
                            "betGroupId": betGroups[0].betGroupId,
                            "name": betGroups[0].name,
                            "selectionHeaders": [{
                                "name": "1",
                                "sortOrder": 1,
                                "isLine": false
                            }, {
                                "name": "X",
                                "sortOrder": 2,
                                "isLine": false
                            }, {
                                "name": "2",
                                "sortOrder": 3,
                                "isLine": false
                            }]
                        }];

                        var maxPopularity = _.chain(events).pluck("popularityRank").max().value();
                        var maxStartDateTime = _.chain(events).pluck("startDateTime").max().value();
                        var minStartDateTime = _.chain(events).pluck("startDateTime").min().value();

                        return _.merge({
                            headers: header,
                            eventRows: events,
                            configuration: config,
                            limit: options.limit,
                            popularityRank: maxPopularity,
                            maxStartDateTime: maxStartDateTime,
                            minStartDateTime: minStartDateTime
                        });
                    });
                });
            };

            StartingSoonViewModelAdapter.prototype.toEventRow = function (event) {
                var firstMarket = event.getMarkets()[0];

                if (!firstMarket) {
                    return null;
                }

                var numberOfSelectionsForFirstMarket = firstMarket.selections.length;
                var isValidForStartingSoon = numberOfSelectionsForFirstMarket === 2 || numberOfSelectionsForFirstMarket === 3;

                if (!isValidForStartingSoon) {
                    return null;
                }

                return EventTableViewModelAdapter.prototype.toEventRow.apply(this, arguments);
            };

            StartingSoonViewModelAdapter.prototype.toViewModel = function (events, options) {
                var self = this;

                var toStartingSoonTable = function (events) {
                    var table = self.toTable(events, {
                        limit: -1,
                        numberOfColumns: 1
                    });

                    return table;
                };

                return self.toEventRows(events).then(function (transformedEvents) {
                    return toStartingSoonTable(transformedEvents);
                });
            };


            StartingSoonViewModelAdapter.prototype.toMarketCell = function () {
                var marketCell = EventTableViewModelAdapter.prototype.toMarketCell.apply(this, arguments);

                marketCell.selections = _.map(marketCell.selections, function (selectionModel, index) {
                    var isLastSelection = index === marketCell.selections.length - 1;
                    return new StartingSoonSelectionProxy(selectionModel, isLastSelection);
                });

                if (marketCell.selections.length === 2) {
                    marketCell.selections.splice(1, 0, this.toEmptySelection(2));
                }

                return marketCell;
            };

            StartingSoonViewModelAdapter.prototype.registerEventsAddedListener = function (scope, collection, dataSourceName, options) {

                var self = this;

                var groupings = function (tables) {
                    return _.chain(tables).pluck("categoryNode").pluck("id").uniq().value();
                };

                var exists = function (groupingIds, evt) {
                    return _.contains(groupingIds, evt.category.id);
                };

                EventTableViewModelAdapter.prototype._registerEventsAddedListener.call(self, scope, collection, dataSourceName, groupings, exists, options);
            };

            return new StartingSoonViewModelAdapter();

        }]);

    angular
        .module("sportsbook.markets")
        .factory("liveEventTableViewModelAdapterByCategory", ["lodash", "eventTableViewModelAdapterByCategory", function (_, eventTableViewModelAdapterByCategory) {

            function LiveEventTableViewModelAdapterByCategory() {
                eventTableViewModelAdapterByCategory.constructor.call(this);
                this.isLive = true;
            }

            LiveEventTableViewModelAdapterByCategory.prototype = Object.create(eventTableViewModelAdapterByCategory);
            LiveEventTableViewModelAdapterByCategory.prototype.constructor = LiveEventTableViewModelAdapterByCategory;

            return new LiveEventTableViewModelAdapterByCategory();

        }]);

}(window.angular));
