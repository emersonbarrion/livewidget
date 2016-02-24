(function (angular) {
    "use strict";

    angular.module("sportsbook.markets").factory("baseEventDataSourceFactory", ["$rootScope", "eventDataSourceManagerConfiguration",
        function ($rootScope, eventDataSourceManagerConfiguration) {
            function BaseEventDataSource(dataSourceName) {
                this.dataSourceName = dataSourceName;
            }

            BaseEventDataSource.prototype.initialiseEvents = function (newEvents) {
                throw new Error("Not implemented");
            };

            BaseEventDataSource.prototype.processUpdatedEvents = function (eventDiffs) {
                throw new Error("Not implemented");
            };

            BaseEventDataSource.prototype.processNewEvents = function (newEvents) {
                throw new Error("Not implemented");
            };

            BaseEventDataSource.prototype.processDeletedEvents = function (deletedEventIds) {
                throw new Error("Not implemented");
            };

            BaseEventDataSource.prototype.initialiseMarkets = function (newEvents) {
                throw new Error("Not implemented");
            };

            BaseEventDataSource.prototype.processUpdatedMarkets = function (marketDiffs) {
                throw new Error("Not implemented");
            };

            BaseEventDataSource.prototype.processNewMarkets = function (newEvents) {
                throw new Error("Not implemented");
            };

            BaseEventDataSource.prototype.processDeletedMarkets = function (deletedEventIds) {
                throw new Error("Not implemented");
            };

            BaseEventDataSource.prototype.eventsSource = function (isFirstRequest) {
                throw new Error("Not implemented");
            };

            BaseEventDataSource.prototype.notifyEvents = function (changeSummary) {

                if (!_.isEmpty(changeSummary.removed)) {
                    this.processDeletedEvents(changeSummary.removed);
                    $rootScope.$broadcast(eventDataSourceManagerConfiguration.getEventsDeletedBroadcast(this.dataSourceName), changeSummary.removed);
                }

                var newItems;

                if (!_.isEmpty(changeSummary.added)) {
                    newItems = _.values(changeSummary.added);

                    this.processNewEvents(newItems);
                    $rootScope.$broadcast(eventDataSourceManagerConfiguration.getEventsAddedBroadcast(this.dataSourceName), newItems);
                } else if (changeSummary.initialised) {
                    newItems = _.values(changeSummary.initialised);
                    this.initialiseEvents(newItems);
                }

                if (!_.isEmpty(changeSummary.updates)) {
                    var diffs = _.values(changeSummary.updates);

                    this.processUpdatedEvents(diffs);
                    $rootScope.$broadcast(eventDataSourceManagerConfiguration.getEventsUpdatedBroadcast(this.dataSourceName), diffs);
                }
            };

            BaseEventDataSource.prototype.notifyMarkets = function (changeSummary) {

                if (!_.isEmpty(changeSummary.removed)) {
                    this.processDeletedMarkets(changeSummary.removed);
                    $rootScope.$broadcast(eventDataSourceManagerConfiguration.getMarketsDeletedBroadcast(this.dataSourceName), changeSummary.removed);
                }

                var newItems;

                if (!_.isEmpty(changeSummary.added)) {
                    newItems = _.values(changeSummary.added);

                    this.processNewMarkets(newItems);
                    $rootScope.$broadcast(eventDataSourceManagerConfiguration.getMarketsAddedBroadcast(this.dataSourceName), newItems);
                } else if (changeSummary.initialised) {
                    newItems = _.values(changeSummary.initialised);
                    this.initialiseMarkets(newItems);
                }

                if (!_.isEmpty(changeSummary.updates)) {
                    var diffs = _.values(changeSummary.updates);

                    this.processUpdatedMarkets(diffs);
                    $rootScope.$broadcast(eventDataSourceManagerConfiguration.getMarketsUpdatedBroadcast(this.dataSourceName), diffs);
                }
            };

            return BaseEventDataSource;
        }
    ]);

    angular
        .module("sportsbook.markets")
        .service("eventDataSourceManager", ["$q", "$log", "lodash", "applicationState", "$rootScope", "eventDataSourceManagerConfiguration", "variableSelectionListDataSourceFactory", "genericEventListDataSourceFactory", "mockDataSourceFactory", "diff", "queue", "resourceRepository", "eventModelFactory", "marketModelFactory",
            function ($q, $log, _, applicationState, $rootScope, eventDataSourceManagerConfiguration, variableSelectionListDataSourceFactory, genericEventListDataSourceFactory, mockDataSourceFactory, diff, queue, repositories, eventModelFactory, marketModelFactory) {
                var self = this;

                var configuration = eventDataSourceManagerConfiguration.configuration;

                self._dataSourceNamesByGroup = {
                    "all": [],
                    "default": []
                };

                self._dataSourcesByName = {};

                function _removeDataSource(dataSourceName) {

                    _.forEach(_.values(self._dataSourceNamesByGroup), function (group) {
                        _.remove(group, function (d) {
                            return d === dataSourceName;
                        });
                    });

                    if (_.get(self._dataSourcesByName, dataSourceName, false)) {
                        delete self._dataSourcesByName[dataSourceName];
                    }

                    return $q.all([
                        repositories.removeDataSourceFrom("events", dataSourceName),
                        repositories.removeDataSourceFrom("markets", dataSourceName)
                    ]);
                }

                self.eventComparer = diff.events.bind(diff);
                self.marketComparer = diff.markets.bind(diff);

                self.marketMerger = function (market, changes) {

                    if (market.id !== changes.id) {
                        return;
                    }

                    if (changes.newName) {
                        market.name = changes.newName;
                    }

                    if (changes.newBetGroupName) {
                        market.betGroup.name = changes.newBetGroupName;
                    }

                    if (changes.newEventName) {
                        market.eventName = changes.newEventName;
                    }

                    if (!_.isUndefined(changes.newIsOnHold)) {
                        market.isOnHold = changes.newIsOnHold;
                    }

                    var selectionDiffsById = changes.selectionDiffsById;

                    if (!_.isEmpty(selectionDiffsById)) {
                        _.forEach(market.selections, function (selection) {
                            var selectionDiff = selectionDiffsById[selection.id];

                            if (selectionDiff) {
                                if (selectionDiff.newName) {
                                    selection.name = selectionDiff.newName;
                                }

                                if (selectionDiff.newMarketName) {
                                    selection.marketName = selectionDiff.newMarketName;
                                }

                                if (selectionDiff.newEventName) {
                                    selection.eventName = selectionDiff.newEventName;
                                }

                                if (!_.isUndefined(selectionDiff.newIsOnHold)) {
                                    selection.isOnHold = selectionDiff.newIsOnHold;
                                }

                                if (selectionDiff.newOdds) {
                                    selection.odds = selectionDiff.newOdds;
                                }

                                selection.isDisabled = selection.odds === 1.00;
                            }
                        });
                    }

                }.bind(self);

                self.scoreboardMerger = function (scoreboard, changes) {

                    if (changes.score) {

                        _.chain(changes.score).keys().forEach(function (key) {

                            var score = changes.score[key];

                            // Update the score
                            if (score.total) {
                                scoreboard.score[key].total = score.total.newValue;
                            }

                            // Update the score by phase.
                            _.chain(changes.score[key].byPhase).keys().forEach(function (phase) {
                                scoreboard.score[key].byPhase[phase] = changes.score[key].byPhase[phase].newValue;
                            }).value();

                        }).value();
                    }

                    if (changes.stats) {

                        _.chain(changes.stats).keys().forEach(function (name) {

                            var stat = changes.stats[name];

                            _.chain(stat).keys().forEach(function (participantId) {

                                var value = stat[participantId];

                                // Update the score
                                if (value.total) {
                                    scoreboard.stats[name][participantId].total = value.total.newValue;
                                }

                                // Update the score by phase.
                                _.chain(stat[participantId].byPhase).keys().forEach(function (phase) {
                                    scoreboard.stats[name][participantId].byPhase[phase] = stat[participantId].byPhase[phase].newValue;
                                }).value();

                            }).value();

                        }).value();
                    }

                    if (changes.server) {

                        _.chain(changes.server).keys().forEach(function (key) {

                            var server = changes.server[key];

                            if (server.total) {
                                scoreboard.server[key].total = server.total.newValue;
                            }

                            _.chain(changes.server[key].byPhase).keys().forEach(function (phase) {
                                scoreboard.server[key].byPhase[phase] = changes.server[key].byPhase[phase].newValue;
                            }).values();

                        }).value();
                    }

                    if (changes.matchClock) {
                        if (changes.matchClock.newMinutes) {
                            scoreboard.matchClock.minutes = changes.matchClock.newMinutes;
                        }

                        if (changes.matchClock.newSeconds) {
                            scoreboard.matchClock.seconds = changes.matchClock.newSeconds;
                        }

                        if (!_.isUndefined(changes.matchClock.newIsStopped)) {
                            scoreboard.matchClock.isStopped = changes.matchClock.newIsStopped;
                        }
                    }

                    if (changes.currentPhase) {
                        scoreboard.currentPhase.id = changes.currentPhase.newId;
                        scoreboard.currentPhase.text = changes.currentPhase.newText;
                    }

                }.bind(self);

                self.eventMerger = function (event, changes) {

                    if (event.id !== changes.id) {
                        return;
                    }

                    if (!_.isUndefined(changes.newName)) {
                        event.name = changes.newName;
                    }

                    if (!_.isUndefined(changes.newMarketCount)) {
                        event.marketCount = changes.newMarketCount;
                    }

                    if (!_.isUndefined(changes.newIsLive)) {
                        event.isLive = changes.newIsLive;
                    }

                    if (!_.isUndefined(changes.newScoreboard)) {
                        event.scoreboard = changes.newScoreboard;
                    } else if (event.scoreboard && changes.scoreboard) {
                        self.scoreboardMerger(event.scoreboard, changes.scoreboard);
                    }
                }.bind(self);

                function getDataSourcesToReload(dataSourceNames, isFirstRequest) {
                    return $q.all(_.map(dataSourceNames, function (dataSourceName) {
                        return self._dataSourcesByName[dataSourceName].eventsSource(isFirstRequest).then(function (serverEvents) {
                            return {
                                dataSourceName: dataSourceName,
                                serverEvents: serverEvents
                            };
                        });
                    })).then(function (serverEventDataSourceNamePairs) {
                        var result = {};

                        _.forEach(serverEventDataSourceNamePairs, function (pair) {
                            result[pair.dataSourceName] = pair.serverEvents;
                        });

                        return result;
                    });
                }

                var _eventsExtractor = function (events) {
                    return events;
                };
                var _marketsExtractor = function (events) {
                    return _.chain(events).map("markets").flatten().value();
                };

                /**
                 * Reload a single data source
                 * @param  {string}  datasourceName [description]
                 * @param  {Boolean} isFirstRequest [description]
                 * @return {Promise}                 [description]
                 */
                function _reload(datasourceName, isFirstRequest) {
                    $log.debug("Event Data Source Manager: Reloading data source", datasourceName);

                    return getDataSourcesToReload([datasourceName], isFirstRequest).then(function (serverEventsByDataSourceName) {

                        return $q.all({
                            markets: repositories.update("markets", serverEventsByDataSourceName, _marketsExtractor, marketModelFactory, self.marketComparer, self.marketMerger),
                            events: repositories.update("events", serverEventsByDataSourceName, _eventsExtractor, eventModelFactory, self.eventComparer, self.eventMerger)
                        }).then(function (changeSummariesByDataSourceName) {

                            _.forEach(changeSummariesByDataSourceName.events, function (changeSummary, dataSourceName) {
                                self._dataSourcesByName[dataSourceName].notifyEvents(changeSummary);
                            });

                            _.forEach(changeSummariesByDataSourceName.markets, function (changeSummary, dataSourceName) {
                                self._dataSourcesByName[dataSourceName].notifyMarkets(changeSummary);
                            });

                            var hasChanges = _.some(changeSummariesByDataSourceName.events, function (changeSummary) {
                                return !_.isEmpty(changeSummary);
                            });

                            return hasChanges;

                        });

                    });
                }

                //This will be used to wrap data source factories so that they are uniformally stored and loaded from the server.
                function _wrapFactory(DataSourceFactory) {

                    return function (dataSourceName, parameters, groups) {
                        $log.debug("Event Data Source Manager: Creating data source", dataSourceName);

                        return queue.enqueue("events-" + dataSourceName, function () {

                            return _removeDataSource(dataSourceName).then(function () {

                                self._dataSourcesByName[dataSourceName] = new DataSourceFactory(dataSourceName, self, parameters);

                                self._dataSourceNamesByGroup.all.push(dataSourceName);

                                if (!groups || !_.isArray(groups) || _.isEmpty(groups)) {
                                    groups = ["default"];
                                }

                                _.forEach(groups, function (g) {
                                    if (!self._dataSourceNamesByGroup[g]) {
                                        self._dataSourceNamesByGroup[g] = [];
                                    }
                                    self._dataSourceNamesByGroup[g].push(dataSourceName);
                                });

                                return _reload(dataSourceName, true).then(function () {
                                    return self._dataSourcesByName[dataSourceName];
                                });

                            });

                        }, "wrapFactory");
                    };
                }

                self.createVariableSelectionListDataSource = _wrapFactory(variableSelectionListDataSourceFactory);
                self.createGenericEventListDataSource = _wrapFactory(genericEventListDataSourceFactory);
                self.createMockDataSource = _wrapFactory(mockDataSourceFactory);

                self.isLoading = function (dataSourceName) {
                    return queue.isLoading("events-" + dataSourceName);
                };

                self.getAllMarkets = function () {
                    return self.getMarkets();
                };

                self.getMarkets = function (filter) {

                    var markets = _.chain(repositories.get("markets").resourcesById).values();

                    if (filter) {
                        markets = markets.filter(filter);
                    }

                    return _.sortBy(markets.value(), "id");
                };

                self.getAllEvents = function () {
                    return self.getEvents();
                };

                self.getEvents = function (filter) {

                    var events = _.chain(repositories.get("events").resourcesById).values();

                    if (filter) {
                        events = events.filter(filter);
                    }

                    return _.sortBy(events.value(), "id");
                };

                self.removeDataSource = function (dataSourceName) {
                    return queue.enqueue("events-" + dataSourceName, function () {
                        return _removeDataSource(dataSourceName);
                    }, "removeDataSource");
                };

                self.removeDataSourcesByGroup = function (group) {
                    if (!_.isArray(self._dataSourceNamesByGroup[group])) {
                        return $q.when();
                    }

                    return $q.all(_.map(self._dataSourceNamesByGroup[group], function (dataSourceName) {
                        return self.removeDataSource(dataSourceName);
                    }));
                };

                self.reloadDataSource = function (dataSourceName) {
                    if (self.isLoading(dataSourceName)) {
                        $log.warn("Event Data Source Manager: Did not reload data source '" + dataSourceName + "' since it was busy");
                        return $q.when(false);
                    }

                    return queue.enqueue("events-" + dataSourceName, function () {
                        return _reload(dataSourceName, false);
                    }, "reloadDataSource");
                };

                self.reload = function (group) {
                    group = group || "default";
                    var dataSourceNames = self._dataSourceNamesByGroup[group];

                    return $q.all(_.map(dataSourceNames, function (dataSourceName) {
                        return self.reloadDataSource(dataSourceName);
                    }));
                };

                self.reloadAll = function () {
                    return self.reload("all");
                };
            }
        ]);

})(window.angular);