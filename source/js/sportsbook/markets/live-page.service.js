(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.markets");

    module.service("_livePageService", [
        "livePageConfigurations",
        "eventTableViewModelAdapterByCategory",
        "widgetConfigurations",
        "liveEventTableViewModelAdapterByCategory",
        "eventDataSourceManager",
        "$q",
        "eventPhases",
        "eventSortFields",

        function (
            livePageConfigurations,
            eventTableViewModelAdapterByCategory,
            widgetConfigurations,
            liveEventTableViewModelAdapterByCategory,
            eventDataSourceManager,
            $q,
            eventPhases,
            eventSortFields
        ) {
            var LIVE_MULTIPLE_EVENTS_TABLE_POSTFIX = "Live";

            function LivePageData(data) {
                this.liveMultipleEventsTables = data.liveMultipleEventsTables;
                this.dataSourcePrefix = data.dataSourcePrefix;
            }

            LivePageData.prototype.destroy = function () {
                eventDataSourceManager.removeDataSource(this.dataSourcePrefix + LIVE_MULTIPLE_EVENTS_TABLE_POSTFIX);
            };

            LivePageData.prototype.registerDataSourceListeners = function (scope) {
                var liveDataSourceName = this.dataSourcePrefix + LIVE_MULTIPLE_EVENTS_TABLE_POSTFIX;

                liveEventTableViewModelAdapterByCategory.registerEventsDeletedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);
                liveEventTableViewModelAdapterByCategory.registerEventsAddedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);
                liveEventTableViewModelAdapterByCategory.registerEventsUpdatedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);

                liveEventTableViewModelAdapterByCategory.registerMarketsDeletedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);
                liveEventTableViewModelAdapterByCategory.registerMarketsAddedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);
                liveEventTableViewModelAdapterByCategory.registerMarketsUpdatedListener(scope, this.liveMultipleEventsTables, liveDataSourceName);
            };

            this.getData = function (dataSourcePrefix) {

                return livePageConfigurations.get().then(function (config) {
                    if (_.isEmpty(config)) {
                        return $q.reject("_livePageService.getData: 'config' was either empty or not found!");
                    }

                    return $q.all({

                        liveMultipleEventsTable: widgetConfigurations.getBetGroupsForMultipleEventTables({
                            categoryIds: config.liveMultipleEventsTable.categoryIds,
                            live: true
                        }).then(function (betGroupIds) {
                            return eventDataSourceManager.createGenericEventListDataSource(dataSourcePrefix + LIVE_MULTIPLE_EVENTS_TABLE_POSTFIX, {
                                categoryIds: config.liveMultipleEventsTable.categoryIds,
                                betGroupIds: betGroupIds,
                                eventCount: config.liveMultipleEventsTable.limit,
                                eventSortBy: eventSortFields.POPULARITY,
                                phase: eventPhases.LIVE,
                                onlyEvenLineMarkets: true
                            }, ["live", "page"]);
                        })
                    }).then(function (dataSources) {
                        return $q.all({
                            liveMultipleEventsTable: liveEventTableViewModelAdapterByCategory.toViewModel(dataSources.liveMultipleEventsTable.content, {
                                configurationSection: "live-competition-section"
                            })
                        });
                    }).then(function (viewModels) {
                        return new LivePageData({
                            liveMultipleEventsTables: viewModels.liveMultipleEventsTable,
                            dataSourcePrefix: dataSourcePrefix
                        });
                    });
                });
            };
        }
    ]);
}(window.angular));