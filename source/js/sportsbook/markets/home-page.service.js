(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.markets");

    module.service("_homePageService", [
        "homePageConfigurations",
        "eventTableViewModelAdapterByCategory",
        "widgetConfigurations",
        "liveEventTableViewModelAdapterByCategory",
        "eventDataSourceManager",
        "$q",
        "betGroupCompositeViewModelAdapter",
        "eventPhases",
        "eventSortFields",

        function (
            homePageConfigurations,
            eventTableViewModelAdapterByCategory,
            widgetConfigurations,
            liveEventTableViewModelAdapterByCategory,
            eventDataSourceManager,
            $q,
            betGroupCompositeViewModelAdapter,
            eventPhases,
            eventSortFields
        ) {
            var LIVE_MULTIPLE_EVENTS_TABLE_POSTFIX = "Live";
            var STARTING_SOON_EVENTS_TABLE_POSTFIX = "StartingSoon";


            function HomePageData(data) {
                this.mostPopular = data.mostPopular;
                this.startingSoon = data.startingSoon;
                this.multipleEventsTables = data.multipleEventsTables;
                this.liveMultipleEventsTables = data.liveMultipleEventsTables;

                this.dataSourcePrefix = data.dataSourcePrefix;
                this.startingSoonConfig = data.startingSoonConfig;
            }

            HomePageData.prototype.destroy = function () {
                eventDataSourceManager.removeDataSource(this.dataSourcePrefix);
                eventDataSourceManager.removeDataSource(this.dataSourcePrefix + LIVE_MULTIPLE_EVENTS_TABLE_POSTFIX);
                eventDataSourceManager.removeDataSource(this.dataSourcePrefix + STARTING_SOON_EVENTS_TABLE_POSTFIX);
            };

            HomePageData.prototype.registerDataSourceListeners = function (scope) {
                var self = this;

                var dataSourceName = this.dataSourcePrefix;
                var liveDataSourceName = this.dataSourcePrefix + LIVE_MULTIPLE_EVENTS_TABLE_POSTFIX;
                var startingSoonDataSourceName = this.dataSourcePrefix + STARTING_SOON_EVENTS_TABLE_POSTFIX;

                betGroupCompositeViewModelAdapter.registerEventsDeletedListener(scope, self.startingSoon, startingSoonDataSourceName, self.startingSoonConfig.compositeColumns);
                betGroupCompositeViewModelAdapter.registerEventsAddedListener(scope, self.startingSoon, startingSoonDataSourceName, self.startingSoonConfig.compositeColumns);
                betGroupCompositeViewModelAdapter.registerEventsUpdatedListener(scope, self.startingSoon, startingSoonDataSourceName, self.startingSoonConfig.compositeColumns);

                betGroupCompositeViewModelAdapter.registerMarketsDeletedListener(scope, self.startingSoon, startingSoonDataSourceName, self.startingSoonConfig.compositeColumns);
                betGroupCompositeViewModelAdapter.registerMarketsAddedListener(scope, this.startingSoon, startingSoonDataSourceName, self.startingSoonConfig.compositeColumns);
                betGroupCompositeViewModelAdapter.registerMarketsUpdatedListener(scope, this.startingSoon, startingSoonDataSourceName, self.startingSoonConfig.compositeColumns);

                liveEventTableViewModelAdapterByCategory.registerEventsDeletedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);
                liveEventTableViewModelAdapterByCategory.registerEventsAddedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);
                liveEventTableViewModelAdapterByCategory.registerEventsUpdatedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);

                liveEventTableViewModelAdapterByCategory.registerMarketsDeletedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);
                liveEventTableViewModelAdapterByCategory.registerMarketsAddedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);
                liveEventTableViewModelAdapterByCategory.registerMarketsUpdatedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);

                eventTableViewModelAdapterByCategory.registerEventsDeletedListener(scope, this.multipleEventsTables, dataSourceName);
                eventTableViewModelAdapterByCategory.registerEventsAddedListener(scope, this.multipleEventsTables, dataSourceName);
                eventTableViewModelAdapterByCategory.registerEventsUpdatedListener(scope, this.multipleEventsTables, dataSourceName);

                eventTableViewModelAdapterByCategory.registerMarketsDeletedListener(scope, this.multipleEventsTables, dataSourceName);
                eventTableViewModelAdapterByCategory.registerMarketsAddedListener(scope, this.multipleEventsTables, dataSourceName);
                eventTableViewModelAdapterByCategory.registerMarketsUpdatedListener(scope, this.multipleEventsTables, dataSourceName);

            };

            this.getData = function (dataSourcePrefix) {

                return homePageConfigurations.get().then(function (config) {
                    if (_.isEmpty(config)) {
                        return $q.reject("_homePageService.getData: 'config' was either empty or not found!");
                    }

                    var shouldShowStartingSoon = !_.isUndefined(config.startingSoon);

                    return $q.all({

                        liveMultipleEventsTable: widgetConfigurations.getBetGroupsForHomepageLiveEventsTables({
                            categoryIds: config.liveMultipleEventsTable.categoryIds
                        }).then(function (betGroupIds) {
                            return eventDataSourceManager.createGenericEventListDataSource(dataSourcePrefix + LIVE_MULTIPLE_EVENTS_TABLE_POSTFIX, {
                                categoryIds: config.liveMultipleEventsTable.categoryIds,
                                betGroupIds: betGroupIds,
                                eventCount: config.liveMultipleEventsTable.limit,
                                eventSortBy: eventSortFields.POPULARITY,
                                phase: eventPhases.LIVE,
                                onlyEvenLineMarkets: true
                            }, ["live", "page"]);
                        }),

                        multipleEventsTable: widgetConfigurations.getBetGroupsForMultipleEventTables({
                            categoryIds: config.multipleEventsTable.categoryIds
                        }).then(function (betGroupIds) {
                            return eventDataSourceManager.createGenericEventListDataSource(dataSourcePrefix, {
                                categoryIds: config.multipleEventsTable.categoryIds,
                                betGroupIds: betGroupIds,
                                eventCount: config.multipleEventsTable.limit,
                                phase: eventPhases.PREMATCH
                            }, ["default", "page"]);
                        }),

                        startingSoon: (!shouldShowStartingSoon) ?
                            null :
                            eventDataSourceManager.createGenericEventListDataSource(dataSourcePrefix + STARTING_SOON_EVENTS_TABLE_POSTFIX, {
                                categoryIds: [],
                                betGroupIds: config.startingSoon.betGroupIds,
                                eventCount: config.startingSoon.limit,
                                eventSortBy: eventSortFields.DATE, // sort events by date - starting soon
                                phase: eventPhases.PREMATCH
                            }, ["default", "page"])

                    }).then(function (dataSources) {
                        return $q.all({
                            multipleEventsTable: eventTableViewModelAdapterByCategory.toViewModel(dataSources.multipleEventsTable.content),
                            liveMultipleEventsTable: liveEventTableViewModelAdapterByCategory.toViewModel(dataSources.liveMultipleEventsTable.content, {
                                configurationSection: "homepage-live-events-section"
                            }),
                            startingSoon: (shouldShowStartingSoon) ?
                                betGroupCompositeViewModelAdapter.toViewModel(dataSources.startingSoon.content, config.startingSoon.compositeColumns)
                                : null
                        });
                    }).then(function (viewModels) {
                        return new HomePageData({
                            mostPopular: config.mostPopular,
                            startingSoon: viewModels.startingSoon,
                            startingSoonConfig: config.startingSoon,
                            multipleEventsTables: viewModels.multipleEventsTable,
                            liveMultipleEventsTables: viewModels.liveMultipleEventsTable,
                            dataSourcePrefix: dataSourcePrefix
                        });
                    });
                });
            };
        }
    ]);
}(window.angular));
