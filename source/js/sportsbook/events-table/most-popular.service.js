(function (angular) {
    "use strict";

    angular
        .module("sportsbook.markets")
        .service("mostPopularService", ["widgetConfigurations", "eventDataSourceManager", "eventTableViewModelAdapterByCategory", "catalogue",
            function (widgetConfigurations, eventDataSourceManager, eventTableViewModelAdapterByCategory, catalogue) {

                var NUMBER_OF_COLUMNS = 1;

                this.getData = function (categoryId, dataSourceName, limit) {

                    categoryId = Number(categoryId);
                    if (_.isNaN(categoryId)) {
                        throw new Error("categoryId is not a valid number");
                    }

                    if (!limit) {
                        limit = 10;
                    }

                    return widgetConfigurations.getBetGroupsForMultipleEventTables({
                        categoryIds: [categoryId]
                    }).then(function (betGroupIds) {
                        return eventDataSourceManager.createGenericEventListDataSource(dataSourceName, {
                            categoryIds: [categoryId],
                            betGroupIds: betGroupIds,
                            eventCount: limit,
                            eventSortBy: 1
                        }, ["default", "page"]);
                    }).then(function (pageData) {
                        return eventTableViewModelAdapterByCategory.toViewModel(pageData.content, {
                            numberOfColumns: NUMBER_OF_COLUMNS
                        });
                    });

                };

                this.getCategories = function (options) {
                    if (_.isUndefined(options)) {
                        throw new Error("Options should be defined");
                    }

                    // Get the category definitions from the catalogue.
                    return catalogue.getMenu().then(function (categoryList) {

                        if (_.isArray(options.categoryIds) && !_.isEmpty(options.categoryIds)) {

                            return _.chain(categoryList)
                                .filter(function (c) {
                                    return _.includes(options.categoryIds, c.id);
                                })
                                .value();

                        } else {

                            if (_.isNaN(options.limit)) {
                                options.limit = 6;
                            }

                            return _.chain(categoryList)
                                .filter(function (c) {
                                    return c.eventCount > 0;
                                })
                                .sortBy("sortRank.popularityRank")
                                .take(options.limit)
                                .value();

                        }

                    });
                };

                this.registerDataSourceListeners = function (scope, viewModel, dataSourceName) {
                    eventTableViewModelAdapterByCategory.registerEventsDeletedListener(scope, viewModel, dataSourceName);
                    eventTableViewModelAdapterByCategory.registerEventsAddedListener(scope, viewModel, dataSourceName, { numberOfColumns: NUMBER_OF_COLUMNS });

                    eventTableViewModelAdapterByCategory.registerMarketsDeletedListener(scope, viewModel, dataSourceName);
                    eventTableViewModelAdapterByCategory.registerMarketsAddedListener(scope, viewModel, dataSourceName);
                    eventTableViewModelAdapterByCategory.registerMarketsUpdatedListener(scope, viewModel, dataSourceName);
                };

                this.destroy = function (dataSourceName) {
                    eventDataSourceManager.removeDataSource(dataSourceName);
                };

            }
        ]);

})(window.angular);
