(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.winnerList');

    function WinnerMarketMapper(widgetConfig) {
        this.widgetConfig = widgetConfig;
    }

    WinnerMarketMapper.prototype.mapEvents = function (events) {
        var self = this;
        return _.compact(_.map(events, function (e) {
            return self.mapEvent(e);
        }));
    };

    WinnerMarketMapper.prototype.mapEvent = function (event) {
        var self = this;
        var groupedMarkets = _.chain(event.getMarkets()).sortBy("betGroup.id").groupBy("betGroup.id").value();
        var betGroups = self.mapBetGroups(groupedMarkets);
        if (!betGroups.length) {
            return null;
        }
        return {
            id: event.id,
            name: event.name,
            betGroups: betGroups
        };
    };

    WinnerMarketMapper.prototype.mapBetGroups = function (groupedMarkets) {
        var self = this;
        return _.compact(_.map(groupedMarkets, function (marketsForBetGroup) {
            return self.mapBetGroup(marketsForBetGroup);
        }));
    };

    WinnerMarketMapper.prototype.mapBetGroup = function (marketsForBetGroup) {
        var self = this;

        var betGroupFromConfig = _.find(self.widgetConfig.groups, {
            "betGroupId": marketsForBetGroup[0].betGroup.id
        });

        if (_.isUndefined(betGroupFromConfig)) {
            return null;
        }

        return {
            config: betGroupFromConfig,
            id: marketsForBetGroup[0].betGroup.id,
            name: marketsForBetGroup[0].betGroup.name,
            isHeadToHead: betGroupFromConfig.isHeadToHead,
            text: marketsForBetGroup[0].betGroup.text,
            markets: self.mapMarkets(marketsForBetGroup)
        };
    };

    WinnerMarketMapper.prototype.mapMarkets = function (markets) {
        var self = this;
        return _.map(markets, function (m) {
            return self.mapMarket(m);
        });
    };

    WinnerMarketMapper.prototype.mapMarket = function (market) {
        var self = this;
        return {
            id: market.id,
            deadline: market.deadline,
            lineValue: market.lineValue,
            selections: self.mapSelections(market.getSelections()),
            text: market.text
        };
    };

    WinnerMarketMapper.prototype.mapSelections = function (selections) {
        var self = this;
        return _.map(selections, function (selection) {
            return {
                id: selection.id,
                isInCoupon: false,
                isEligible: false,
                originalObj: selection
            };
        });
    };

    WinnerMarketMapper.prototype.map = function (data) {
        var self = this;

        if (_.isUndefined(data)) {
            throw new Error("WinnerMarketMapper: Attempted to map undefined 'data'");
        }

        if (!_.isArray(data)) {
            return self.mapEvent(data);
        }

        return self.mapEvents(data);
    };

    module.factory("winnerListViewModelAdapter", ["applicationState", "catalogueService", "widgetConfigurations", "lodash", "$q", function (applicationState, catalogueService, widgetConfigurations, _, $q) {

        function defaultConfigResolver(categoryId) {
            return widgetConfigurations.getForSection(categoryId, "winner-list").then(function (widgetConfig) {
                return _.defaultsDeep(widgetConfig, {
                    "widgets": []
                });
            });
        }

        function WinnerListViewModelAdapter() {
            // constructor
        }

        WinnerListViewModelAdapter.prototype.addHeadToHead = function (viewModel, widgetConfig) {
            _.each(viewModel.events, function (event) {
                _.each(event.betGroups, function (betGroup) {
                    var betGroupFromConfig = _.find(widgetConfig.groups, {
                        betGroupId: betGroup.id
                    });
                    if (betGroupFromConfig) {
                        betGroup.isHeadToHead = !!betGroupFromConfig.isHeadToHead; // Considering undefined as boolean false
                    }
                });
            });
        };

        WinnerListViewModelAdapter.prototype.mapToViewModel = function (data, config, categoryNode) {
            var winnerMarketViewModels = [];
            for (var i = 0; i < config.widgets.length; ++i) {
                var widgetConfig = config.widgets[i];
                var mapper = new WinnerMarketMapper(widgetConfig);
                var events = mapper.map(data);

                if (events.length === 0) {
                    continue;
                }

                var viewModel = {
                    categoryNode: categoryNode,
                    limit: widgetConfig.limit,
                    layout: widgetConfig.layout,
                    defaultClass: widgetConfig.defaultClass,
                    events: events
                };

                this.addHeadToHead(viewModel, widgetConfig);
                winnerMarketViewModels.push(viewModel);
            }
            return winnerMarketViewModels;
        };

        WinnerListViewModelAdapter.prototype.mapToEventViewModel = function (event, config) {
            var winnerMarketEventsViewModel = [];
            for (var i = 0; i < config.widgets.length; ++i) {
                var widgetConfig = config.widgets[i];
                var mapper = new WinnerMarketMapper(widgetConfig);
                var viewModel = mapper.map(event);
                winnerMarketEventsViewModel.push(viewModel);
            }
            return winnerMarketEventsViewModel;
        };

        WinnerListViewModelAdapter.prototype.mapToBetGroupViewModel = function (marketsInBetGroup, config) {
            var winnerMarketBetGroupViewModel = [];
            for (var i = 0; i < config.widgets.length; ++i) {
                var widgetConfig = config.widgets[i];
                var mapper = new WinnerMarketMapper(widgetConfig);
                var viewModel = mapper.mapBetGroup(marketsInBetGroup);
                winnerMarketBetGroupViewModel.push(viewModel);
            }
            return winnerMarketBetGroupViewModel;
        };

        WinnerListViewModelAdapter.prototype.toViewModel = function (data, configResolver) {
            var self = this;

            if (!configResolver) {
                configResolver = defaultConfigResolver;
            }

            var groupedEvents = _.groupBy(data, "category.id");

            return $q.all(_.map(groupedEvents, function (eventsByCategory, categoryId) {
                return catalogueService.getCategory({
                    id: Number(categoryId)
                }).then(function (categoryNode) {
                    return configResolver(categoryId).then(function (configuration) {
                        return self.mapToViewModel(eventsByCategory, configuration, categoryNode);
                    });
                }, function () {
                    return [];
                });
            })).then(function (widgetViewModelLists) {
                return _.flatten(widgetViewModelLists);
            });
        };

        WinnerListViewModelAdapter.prototype.toEventsViewModel = function (events, configResolver) {
            var self = this;

            if (!configResolver) {
                configResolver = defaultConfigResolver;
            }

            return $q.when(_.map(events, function (event) {
                return configResolver(event.category.id).then(function (configuration) {
                    return self.mapToEventViewModel(event, configuration);
                });
            })).then(function (eventsViewModel) {
                return _.flatten(eventsViewModel);
            });
        };

        /**
         * [toBetGroupViewModel description]
         * @param  {MarketModel[]}  marketsInBetGroup   [description]
         * @param  {Number}         categoryId          [description]
         * @param  {Function=}      configResolver      [description]
         * @return {Promise}                            [description]
         */
        WinnerListViewModelAdapter.prototype.toBetGroupViewModel = function (marketsInBetGroup, categoryId, configResolver) {
            var self = this;

            if (!configResolver) {
                configResolver = defaultConfigResolver;
            }

            return configResolver(categoryId).then(function (configuration) {
                return self.mapToBetGroupViewModel(marketsInBetGroup, configuration);
            });
        };

        /**
         * [toMarketsViewModel description]
         * @param  {MarketModel[]} markets [description]
         * @return {Promise}         [description]
         */
        WinnerListViewModelAdapter.prototype.toMarketsViewModel = function (markets) {
            var mapper = new WinnerMarketMapper();
            return $q.when(mapper.mapMarkets(markets));
        };

        /**
         * [toMarketViewModel description]
         * @param  {MarketModel} market [description]
         * @return {Promise}        [description]
         */
        WinnerListViewModelAdapter.prototype.toMarketViewModel = function (market) {
            var mapper = new WinnerMarketMapper();
            return $q.when(mapper.mapMarket(market));
        };

        /**
         * [mergeNewEvents description]
         * @param  {Object[]} viewModel [description]
         * @param  {EventModel[]} newEvents [description]
         * @return {Promise}           [description]
         */
        WinnerListViewModelAdapter.prototype.mergeNewEvents = function (viewModel, newEvents) {
            if (!viewModel || !newEvents) {
                throw new Error("WinnerListViewModelAdapter#mergeNewEvents: The 'viewModel' or 'newEvents' parameters are invalid.");
            }

            if (_.isEmpty(newEvents) || !_.isArray(newEvents)) {
                throw new Error("WinnerListViewModelAdapter#mergeNewEvents: The 'newEvents' parameter was not a valid Array with at least one element.");
            }

            return this.toViewModel(newEvents).then(function (newEventsViewModel) {
                if (!newEventsViewModel || newEventsViewModel.length < 1) {
                    return false;
                }

                var categoriesToAdd = [];

                _.forEach(newEventsViewModel, function (newEventsViewModelByCategory) {
                    var existingCategoryViewModel = _.find(viewModel, {
                        "categoryNode": {
                            "id": newEventsViewModelByCategory.categoryNode.id
                        }
                    });
                    if (existingCategoryViewModel) {
                        _.forEach(newEventsViewModelByCategory.events, function (e) {
                            var exists = _.some(existingCategoryViewModel.events, {
                                "id": e.id
                            });
                            if (!exists) {
                                existingCategoryViewModel.events.push(e);
                            }
                        });
                    } else {
                        categoriesToAdd.push(newEventsViewModelByCategory);
                    }
                });

                _.forEach(categoriesToAdd, function (vm) {
                    viewModel.push(vm);
                });

                return true;
            });

        };

        WinnerListViewModelAdapter.prototype.mergeUpdatedEvents = function (viewModel, eventDiffs) {
            throw new Error("Not implemented yet.");
        };

        /**
         * [mergeDeletedEvents description]
         * @param  {Object[]} viewModel       [description]
         * @param  {EventModel[]} deletedEvents [description]
         * @return {boolean}                 [description]
         */
        WinnerListViewModelAdapter.prototype.mergeDeletedEvents = function (viewModel, deletedEvents) {
            if (!viewModel || !deletedEvents) {
                throw new Error("WinnerListViewModelAdapter#mergeDeletedEvents: The 'viewModel' or 'deletedEvents' parameters are invalid.");
            }

            if (_.isEmpty(deletedEvents) || !_.isArray(deletedEvents)) {
                throw new Error("WinnerListViewModelAdapter#mergeDeletedEvents: The 'deletedEvents' parameter was not a valid Array with at least one element.");
            }

            // remove any deleted events
            var deletedEventIds = _.chain(deletedEvents).pluck("id").uniq().value();

            var isDeletedEvent = function (event) {
                return _.includes(deletedEventIds, event.id);
            };

            _.remove(viewModel, function (categoryViewModel) {
                _.remove(categoryViewModel.events, isDeletedEvent);
                return _.isEmpty(categoryViewModel.events);
            });

            return true;
        };

        /**
         * [mergeNewMarkets description]
         * @param  {Object[]} viewModel  [description]
         * @param  {MarketModel[]} newMarkets [description]
         * @return {Promise}            [description]
         */
        WinnerListViewModelAdapter.prototype.mergeNewMarkets = function (viewModel, newMarkets) {
            var self = this;

            if (!viewModel || !newMarkets) {
                throw new Error("WinnerListViewModelAdapter#mergeNewMarkets: The 'viewModel' or 'newMarkets' parameters are invalid.");
            }

            if (_.isEmpty(newMarkets) || !_.isArray(newMarkets)) {
                throw new Error("WinnerListViewModelAdapter#mergeNewMarkets: The 'newMarkets' parameter was not a valid Array with at least one element.");
            }

            return $q.all(_.map(newMarkets, function (newMarket) {

                var marketCategoryViewModel = _.find(viewModel, {
                    "events": [{
                        "id": newMarket.eventId
                    }]
                });
                if (_.isUndefined(marketCategoryViewModel)) {
                    // Attempt to add the event to the view model
                    var parentEvent = newMarket.getParent();
                    if (parentEvent) {
                        return self.mergeNewEvents(viewModel, [parentEvent]);
                    }
                    return false;
                }

                var marketEvent = _.find(marketCategoryViewModel.events, {
                    "id": newMarket.eventId
                });
                if (_.isUndefined(marketEvent)) {
                    return false;
                }

                var betGroup = _.find(marketEvent.betGroups, {
                    "id": newMarket.betGroup.id
                });
                if (!betGroup) {
                    // create bet group on event view model
                    return self.toBetGroupViewModel([newMarket], newMarket.categoryId).then(function (newBetGroupViewModel) {
                        _.forEach(newBetGroupViewModel, function (bgVm) {
                            var exists = _.some(marketEvent.betGroups, {
                                "id": bgVm.id
                            });
                            if (!exists) {
                                marketEvent.betGroups.push(bgVm);
                            }
                        });
                        return true;
                    });
                }

                // append the new market to the bet group
                return self.toMarketViewModel(newMarket).then(function (newMarketViewModel) {
                    var exists = _.some(betGroup.markets, {
                        "id": newMarketViewModel.id
                    });
                    if (!exists) {
                        betGroup.markets.push(newMarketViewModel);
                        return true;
                    }
                    return false;
                });

            })).then(function (mergeResults) {
                mergeResults = _.compact(mergeResults);
                return mergeResults.length > 0;
            });
        };

        WinnerListViewModelAdapter.prototype.mergeUpdatedMarkets = function (viewModel, marketDiffs) {
            throw new Error("Not implemented yet.");
        };

        /**
         * [mergeDeletedMarkets description]
         * @param  {Object[]} viewModel        [description]
         * @param  {MarketModel[]} deletedMarkets [description]
         * @return {boolean}                  [description]
         */
        WinnerListViewModelAdapter.prototype.mergeDeletedMarkets = function (viewModel, deletedMarkets) {
            if (!viewModel || !deletedMarkets) {
                throw new Error("WinnerListViewModelAdapter#mergeDeletedMarkets: The 'viewModel' or 'deletedMarkets' parameters are invalid.");
            }

            if (_.isEmpty(deletedMarkets) || !_.isArray(deletedMarkets)) {
                throw new Error("WinnerListViewModelAdapter#mergeDeletedMarkets: The 'deletedMarkets' parameter was not a valid Array with at least one element.");
            }

            // remove any deleted markets/bet groups
            var deletedMarketIds = _.chain(deletedMarkets).pluck("id").uniq().value();

            var isDeletedMarket = function (market) {
                return _.includes(deletedMarketIds, market.id);
            };

            _.remove(viewModel, function (categoryViewModel) {
                _.remove(categoryViewModel.events, function (e) {
                    _.remove(e.betGroups, function (bg) {
                        _.remove(bg.markets, isDeletedMarket);
                        return _.isEmpty(bg.markets);
                    });
                    return _.isEmpty(e.betGroups);
                });
                return _.isEmpty(categoryViewModel.events);
            });

            return true;
        };

        WinnerListViewModelAdapter.prototype.connectViewmodelToDataSource = function (scope, collection, dataSourceName) {
            this.registerEventsAddedListener(scope, collection, dataSourceName);
            this.registerEventsDeletedListener(scope, collection, dataSourceName);

            this.registerMarketsAddedListener(scope, collection, dataSourceName);
            this.registerMarketsDeletedListener(scope, collection, dataSourceName);
        };

        WinnerListViewModelAdapter.prototype.overrideViewModel = function (target, source) {
            target.length = 0;
            target.push.apply(target, source);
        };

        /**
         * Registers a broadcast listener to changes to the data source for Winner Markets List events
         * @param  {Scope} scope          [description]
         * @param  {Object[]} viewModel      [description]
         * @param  {String} dataSourceName [description]
         */
        WinnerListViewModelAdapter.prototype.registerEventsDeletedListener = function (scope, viewModel, dataSourceName) {
            var self = this;
            scope.$on(dataSourceName + "-deleted", function (event, deletedEvents) {
                self.mergeDeletedEvents(viewModel, deletedEvents);
            });
        };

        /**
         * Registers a broadcast listener to changes to the data source for Winner Markets List events
         * @param  {Scope} scope          [description]
         * @param  {Object[]} viewModel      [description]
         * @param  {String} dataSourceName [description]
         */
        WinnerListViewModelAdapter.prototype.registerEventsAddedListener = function (scope, viewModel, dataSourceName) {
            var self = this;
            scope.$on(dataSourceName + "-added", function (event, newEvents) {
                self.mergeNewEvents(viewModel, newEvents);
            });
        };

        /**
         * Registers a broadcast listener to changes to the data source for Winner Markets List events
         * @param  {Scope} scope          [description]
         * @param  {Object[]} viewModel      [description]
         * @param  {String} dataSourceName [description]
         */
        WinnerListViewModelAdapter.prototype.registerMarketsDeletedListener = function (scope, viewModel, dataSourceName) {
            var self = this;
            scope.$on(dataSourceName + "-markets-deleted", function (event, removedMarketIds) {
                self.mergeDeletedMarkets(viewModel, removedMarketIds);
            });
        };

        /**
         * Registers a broadcast listener to changes to the data source for Winner Markets List events
         * @param  {Scope} scope          [description]
         * @param  {Object[]} viewModel      [description]
         * @param  {String} dataSourceName [description]
         */
        WinnerListViewModelAdapter.prototype.registerMarketsAddedListener = function (scope, viewModel, dataSourceName) {
            var self = this;
            scope.$on(dataSourceName + "-markets-added", function (event, newMarkets) {
                self.mergeNewMarkets(viewModel, newMarkets);
            });
        };

        return new WinnerListViewModelAdapter();
    }]);

})(window.angular);
