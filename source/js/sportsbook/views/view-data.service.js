(function (angular) {
    "use strict";

    angular.module("sportsbook.markets").service("viewData", [
        "eventDataSourceManager",
        "applicationState",

        "catalogueService",

        "marketSelectionListViewModelAdapter",
        "winnerListViewModelAdapter",
        "eventTableViewModelAdapterByCompetition",
        "eventTableViewModelAdapterByCategory",
        "liveEventTableViewModelAdapterByCategory",
        "betGroupCompositeViewModelAdapter",

        "_viewDataConstructionService",

        "configTypes",
        "eventPhases",
        "searchResults",

        "_homePageService",
        "_livePageService",

        function (eventDataSourceManager,
                  applicationState,
                  catalogueService,
                  marketSelectionListViewModelAdapter,
                  winnerListViewModelAdapter,
                  eventTableViewModelAdapterByCompetition,
                  eventTableViewModelAdapterByCategory,
                  liveEventTableViewModelAdapterByCategory,
                  betGroupCompositeViewModelAdapter,
                  viewDataConstructionService,
                  configTypes,
                  eventPhases,
                  searchResults,
                  homePageService,
                  livePageService) {

            var self = this;

            self._replacePage = function (newPageConfiguration) {
                var configuration = _.defaults(newPageConfiguration, {
                    dataSourceGroups: []
                });

                newPageConfiguration.dataSourceGroups.push("page");

                return eventDataSourceManager.removeDataSourcesByGroup("page").then(function () {
                    return viewDataConstructionService.construct(configuration);
                });
            };


            self.getMarketSelectionsViewData = function (dataSourceNamePrefix, filters) {
                var dataSourceGroups = ["default"];

                if (filters.phase === eventPhases.LIVE) {
                    dataSourceGroups.push("live");
                }

                return self._replacePage({
                    filters: filters,
                    viewModels: [{
                        name: "marketSelections",
                        adapter: marketSelectionListViewModelAdapter,
                        dataSourceName: dataSourceNamePrefix,
                        dataSourceGroups: dataSourceGroups
                    }]
                });
            };

            self.getLiveTableByCategoryViewData = function (dataSourceNamePrefix, filters) {
                return self._replacePage({
                    filters: filters,
                    viewModels: [{
                        name: "liveMultipleEventTables",
                        filters: {
                            phase: eventPhases.LIVE,
                            onlyEvenLineMarkets: true
                        },
                        adapter: liveEventTableViewModelAdapterByCategory,
                        configType: configTypes.LIVE,
                        dataSourceName: dataSourceNamePrefix,
                        dataSourceGroups: ["live"]
                    }]
                });
            };

            self.getBetgroupCompositesViewData = function (dataSourceNamePrefix, filters) {
                return self._replacePage({
                    filters: filters,
                    viewModels: [{
                        name: "prematchMultipleEventTables",
                        filters: {
                            phase: eventPhases.PREMATCH
                        },
                        adapter: betGroupCompositeViewModelAdapter,
                        configType: configTypes.BETGROUP_COMPOSITES,
                        dataSourceName: dataSourceNamePrefix,
                        dataSourceGroups: ["default"]
                    }]
                });
            };

            self.getEventListViewData = function (dataSourceNamePrefix, filters) {
                return self._replacePage({
                    filters: filters,
                    viewModels: [{
                        name: "liveMultipleEventTables",
                        adapter: liveEventTableViewModelAdapterByCategory,
                        configType: configTypes.LIVE,
                        filters: {
                            phase: eventPhases.LIVE,
                            onlyEvenLineMarkets: true
                        },
                        dataSourceName: dataSourceNamePrefix + "Live",
                        dataSourceGroups: ["live"]
                    }, {
                        name: "prematchMultipleEventTables",
                        adapter: eventTableViewModelAdapterByCompetition,
                        configType: configTypes.PREMATCH,
                        filters: {
                            phase: eventPhases.PREMATCH
                        },
                        dataSourceName: dataSourceNamePrefix,
                        dataSourceGroups: ["default"]
                    }, {
                        name: "prematchWinnerLists",
                        adapter: winnerListViewModelAdapter,
                        configType: configTypes.WINNER_LIST,
                        filters: {
                            phase: eventPhases.PREMATCH
                        },
                        dataSourceName: dataSourceNamePrefix + "WinnerList",
                        dataSourceGroups: ["default"]
                    }]
                });
            };


            self.getMultiViewData = function (dataSourceNamePrefix, subCategoryIds) {
                return catalogueService.getCompetitionsById(subCategoryIds).then(function (competitions) {
                    var filters = {
                        subCategoryIds: _.chain(subCategoryIds).map(Number).compact().uniq().value(),
                        categoryIds: _.uniq(_.map(competitions, "root.id"))
                    };

                    return self.getEventListViewData(dataSourceNamePrefix, filters);
                });
            };

            self.getSearchResultsData = function (dataSourceNamePrefix, searchTerm) {
                return searchResults.getSearchResults({
                    text: searchTerm
                }).then(function (participants) {
                    if (participants.length === 0) {
                        return self._replacePage({
                            viewModels: [{
                                name: "liveMultipleEventTables"
                            }, {
                                name: "prematchMultipleEventTables"
                            }, {
                                name: "prematchWinnerLists"
                            }]
                        });
                    }

                    // create an array of event IDs to query the API
                    var eventIds = [];
                    var categoryIds = [];

                    _.forEach(participants, function (participant) {
                        eventIds = _.union(eventIds, participant.events);
                        categoryIds.push(participant.categoryId);
                    });

                    return self._replacePage({
                        filters: {
                            eventIds: eventIds,
                            categoryIds: categoryIds
                        },
                        viewModels: [{
                            name: "liveMultipleEventTables",
                            adapter: liveEventTableViewModelAdapterByCategory,
                            configType: configTypes.LIVE,
                            filters: {
                                phase: eventPhases.LIVE,
                                onlyEvenLineMarkets: true
                            },
                            dataSourceName: dataSourceNamePrefix + "Live",
                            dataSourceGroups: ["live"]
                        }, {
                            name: "prematchMultipleEventTables",
                            adapter: eventTableViewModelAdapterByCategory,
                            configType: configTypes.PREMATCH,
                            filters: {
                                phase: eventPhases.PREMATCH
                            },
                            dataSourceName: dataSourceNamePrefix,
                            dataSourceGroups: ["default"]
                        }, {
                            name: "prematchWinnerLists",
                            adapter: winnerListViewModelAdapter,
                            configType: configTypes.WINNER_LIST,
                            filters: {
                                phase: eventPhases.PREMATCH
                            },
                            dataSourceName: dataSourceNamePrefix + "WinnerList",
                            dataSourceGroups: ["default"]
                        }]
                    });
                });
            };


            /* Refactoring possibility:


             We could possible convert the following pages to also use the _replacePage method, by updating their viewmodel
             adapters. Ideally we would also decouple the configuration from the viewmodel and data, so it is passed to
             replacePage. It would also be nice if we arrived at a point where datasource names don't need to be defined.

             like so:


             self.getLivePageData = function (dataSourceNamePrefix) {
             return widgetConfiguration.get("live-overview-configuration").then(
             function (configuration) {
             return self._replacePage({
             viewModels: [{
             name: "liveMultipleEventTables",
             adapter: eventTableViewModelAdapterByCategory,
             configuration: configuration,
             filters: {
             live: true
             },
             dataSourceGroups: ["live"]
             }]
             });
             });
             };*/


            self.getLivePageData = function (dataSourceNamePrefix) {
                return eventDataSourceManager.removeDataSourcesByGroup("page").then(function () {
                    return livePageService.getData(dataSourceNamePrefix);
                });
            };

            self.getHomePageData = function (dataSourceNamePrefix) {
                return eventDataSourceManager.removeDataSourcesByGroup("page").then(function () {
                    return homePageService.getData(dataSourceNamePrefix);
                });
            };
        }
    ]);
}(window.angular));
