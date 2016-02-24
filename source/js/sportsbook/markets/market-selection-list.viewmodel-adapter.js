(function (angular) {
    "use strict";

    angular
        .module("sportsbook.markets")
        .service("marketSelectionListViewModelAdapter", ["$q", "lodash", "applicationState", "widgetConfigurations", "selectionChunker", "eventDataSourceManagerConfiguration",
            function ($q, lodash, applicationState, widgetConfigurations, chunker, eventDataSourceManagerConfiguration) {
                var self = this;

                self._widgetId = 0;
                self._betGroupGroupingId = 0;

                self.toWidget = function (configuration, marketList, configWidget) {
                    var betGroupGroupings = [];
                    var _betGroupGroupingConfigByBetGroup = {};

                    _.forEach(configWidget.group, function (betGroupGroupingConfig) {
                        var betGroupGrouping = self.toBetGroupGrouping(configuration, marketList, configWidget, betGroupGroupingConfig);

                        if (betGroupGrouping) {
                            betGroupGroupings.push(betGroupGrouping);
                        }

                        _.forEach(betGroupGroupingConfig.betGroups, function (betGroupId) {
                            _betGroupGroupingConfigByBetGroup[betGroupId] = betGroupGroupingConfig;
                        });
                    });

                    if (betGroupGroupings.length === 0) {
                        return null;
                    }

                    return {
                        _betGroupGroupingConfigByBetGroup: _betGroupGroupingConfigByBetGroup,
                        config: configWidget,
                        id: self._widgetId++,
                        title: configWidget.title,
                        template: configWidget.template || configuration.defaultTemplate,
                        betGroupGroupings: betGroupGroupings
                    };
                };

                self.toBetGroupGrouping = function (configuration, marketLists, configWidget, configBetGroupGrouping) {
                    var betGroupGrouping = {};

                    betGroupGrouping.config = configBetGroupGrouping;

                    betGroupGrouping.columns = configBetGroupGrouping.columns || configWidget.defaultColumns;

                    betGroupGrouping._betGroupSet = _.mapKeys(configBetGroupGrouping.betGroups);

                    betGroupGrouping.markets = _.chain(marketLists)
                        .filter(function (m) {
                            return betGroupGrouping._betGroupSet[m.betGroup.id];
                        })
                        .map(self.toMarket.bind(self, betGroupGrouping, configBetGroupGrouping))
                        .compact()
                        .value();

                    if (betGroupGrouping.markets.length === 0) {
                        return null;
                    }

                    //betGroupGrouping.titleKey = configBetGroupGrouping.title;
                    betGroupGrouping.titleKey = (betGroupGrouping.markets.length > 0) ? betGroupGrouping.markets[0].name : undefined;

                    var candidateLimit;

                    if (_.isNumber(configBetGroupGrouping.limit)) {
                        candidateLimit = configBetGroupGrouping.limit;
                    } else if (_.isNumber(configWidget.defaultLimit)) {
                        candidateLimit = configWidget.defaultLimit;
                    } else {
                        candidateLimit = configuration.defaultLimit;
                    }

                    if (candidateLimit && candidateLimit > 0) {
                        betGroupGrouping.limit = candidateLimit;
                    }

                    betGroupGrouping.id = self._betGroupGroupingId++;

                    return betGroupGrouping;
                };

                self.toMarket = function (betGroupGrouping, configBetGroupGrouping, market) {
                    var renderingHint = configBetGroupGrouping.renderingHint ? configBetGroupGrouping.renderingHint : "default";

                    var selectionChunks = chunker.chunk(market.getSelections(), betGroupGrouping, renderingHint);

                    if (selectionChunks.length === 0) {
                        return null;
                    }

                    return {
                        id: market.id,
                        name: market.name,
                        betGroup: market.betGroup,
                        lineValue: market.lineValue,
                        selectionChunks: selectionChunks,
                        selections: market.getSelections(),
                        template: renderingHint,
                        text: market.text,
                        originalMarket: market
                    };
                };

                var removeDeleteMarkets = function (markets, deletedMarkets) {
                    _.remove(markets, function (market) {
                        return _.any(deletedMarkets, {
                            id: market.id
                        });
                    });
                };

                var clearDeletedMarketsFromLayoutGroup = function (layoutGroup, deletedMarkets) {
                    for (var i = 0; i < layoutGroup.widgets.length;) {
                        var widget = layoutGroup.widgets[i];

                        for (var j = 0; j < widget.betGroupGroupings.length;) {
                            var betGroupGrouping = widget.betGroupGroupings[j];

                            removeDeleteMarkets(betGroupGrouping.markets, deletedMarkets);

                            if (betGroupGrouping.markets.length === 0) {
                                widget.betGroupGroupings.splice(j, 1);
                            } else {
                                j++;
                            }
                        }

                        if (widget.betGroupGroupings.length === 0) {
                            layoutGroup.widgets.splice(i, 1);
                        } else {
                            i++;
                        }
                    }
                };

                self.mergeDeletedMarkets = function (viewModel, deletedMarkets) {
                    _.forEach(viewModel.large, function (layoutGroup) {
                        clearDeletedMarketsFromLayoutGroup(layoutGroup, deletedMarkets);
                    });

                    var smallLayoutWidgetList = viewModel.small[0].widgets;

                    for (var i = 0; i < smallLayoutWidgetList.length;) {
                        var widget = smallLayoutWidgetList[i];

                        _.remove(widget.betGroupGroupings, function (betGroupGrouping) {
                            return betGroupGrouping.markets.length === 0;
                        });

                        if (widget.betGroupGroupings.length === 0) {
                            smallLayoutWidgetList.splice(i, 1);
                        } else {
                            i++;
                        }
                    }
                };

                self.mergeNewMarkets = function (viewModel, newMarkets) {
                    _.forEach(newMarkets, function (newMarket) {
                        var hasWidget = _.some(viewModel.large, function (layoutGroup) {
                            return _.some(layoutGroup.widgets, function (widget) {
                                var betGroupGroupingConfig = widget._betGroupGroupingConfigByBetGroup[newMarket.betGroup.id];

                                if (!betGroupGroupingConfig) {
                                    return false;
                                }

                                var betGroupGroupingAlreadyExists = _.some(widget.betGroupGroupings, function (betGroupGrouping) {
                                    if (_.contains(betGroupGrouping.config.betGroups, newMarket.betGroup.id)) {
                                        betGroupGrouping.markets.push(self.toMarket(betGroupGrouping, betGroupGrouping.config, newMarket));
                                        return true;
                                    }
                                });

                                if (!betGroupGroupingAlreadyExists) {
                                    widget.betGroupGroupings.push(
                                        self.toBetGroupGrouping(viewModel.configuration, [newMarket], widget.config, betGroupGroupingConfig)
                                    );
                                }

                                return true;
                            });
                        });

                        if (!hasWidget) {
                            var widgetConfig = _.find(viewModel.configuration.widgets, function (widget) {
                                return _.any(widget.group, function (betGroupGrouping) {
                                    return _.contains(betGroupGrouping.betGroups, newMarket.betGroup.id);
                                });
                            });

                            var newWidget = self.toWidget(viewModel.configuration, [newMarket], widgetConfig);
                            viewModel.small[0].widgets.push(newWidget);

                            var chosenLayoutGroup = viewModel.large[0];

                            if (viewModel.large.length > 1) {
                                for (var i = 1; i < viewModel.large.length; i++) {
                                    var currentLayoutGroup = viewModel.large[i];

                                    if (currentLayoutGroup.widgets.length < chosenLayoutGroup.widgets.length) {
                                        chosenLayoutGroup = currentLayoutGroup;
                                    }
                                }
                            }

                            chosenLayoutGroup.widgets.push(newWidget);
                        }
                    });
                };

                self.toViewModel = function (events) {
                    var event = events[0];
                    var section = (event.isLive) ? "live-event-section" : "event-section";
                    return widgetConfigurations.getForSection(event.category.id, section).then(function (configuration) {
                        // Expand Data
                        var result = {};

                        // Fetch markets matching the group.
                        result.widgets = _.chain(configuration.widgets).map(self.toWidget.bind(self, configuration, event.getMarkets())).compact().value();
                        result.largeLayoutGroups = [];
                        result.smallLayoutGroups = [];

                        if (result.widgets.length > 0) {
                            _.each(configuration.layout, function (value, layoutKey) {
                                var largeLayoutGroups = {};

                                largeLayoutGroups.class = value;
                                largeLayoutGroups.widgets = [];

                                _.each(result.widgets, function (widget, widgetKey) {
                                    if ((widgetKey % configuration.layout.length) === layoutKey) {
                                        largeLayoutGroups.widgets.push(widget);
                                    }
                                });

                                result.largeLayoutGroups.push(largeLayoutGroups);
                            });

                            result.smallLayoutGroups = [{
                                widgets: result.widgets
                            }];
                        }

                        return {
                            event: event,
                            configuration: configuration,
                            large: result.largeLayoutGroups,
                            small: result.smallLayoutGroups,
                            isLive: event.isLive
                        };
                    });
                };

                self.registerMarketsDeletedListener = function (scope, collection, dataSourceName) {
                    scope.$on(eventDataSourceManagerConfiguration.getMarketsDeletedBroadcast(dataSourceName), function (broadcast, deletedMarkets) {
                        self.mergeDeletedMarkets(collection, deletedMarkets);
                    });
                };

                self.registerMarketsAddedListener = function (scope, collection, dataSourceName) {
                    scope.$on(eventDataSourceManagerConfiguration.getMarketsAddedBroadcast(dataSourceName), function (broadcast, newMarkets) {
                        self.mergeNewMarkets(collection, newMarkets);
                    });
                };

                self.connectViewmodelToDataSource = function (scope, collection, dataSourceName) {
                    self.registerMarketsDeletedListener(scope, collection, dataSourceName);
                    self.registerMarketsAddedListener(scope, collection, dataSourceName);
                };

                self.overrideViewModel = function (target, source) {
                    target.event = source.event;
                    target.configuration = source.configuration;
                    target.large = source.large;
                    target.small = source.small;
                    target.isLive = source.isLive;
                };
            }
        ]);

}(window.angular));
