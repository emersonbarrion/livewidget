(function (angular) {
    "use strict";

    function ViewData($q, constructionService, eventDataSourceManager, viewModelProperties, viewModelConfigs, filters, dataSourceGroups, adaptationConfig) {
        var self = this;

        self.$q = $q;

        self._constructionService = constructionService;
        self._eventDataSourceManager = eventDataSourceManager;

        self._viewModelProperties = viewModelProperties;
        self._viewModelConfigs = viewModelConfigs;

        self._filters = filters;
        self._dataSourceGroups = dataSourceGroups;
        self._adaptationConfig = adaptationConfig;

        Object.defineProperty(self, "filters", {
            get: function () {
                return self._filters;
            }
        });

        _.forEach(self._viewModelProperties, function (viewModelProperty) {
            Object.defineProperty(self, viewModelProperty.name, {
                get: function () {
                    return viewModelProperty.viewModel;
                }
            });
        });


        self._isUpdating = false;
    }

    ViewData.prototype.destroy = function () {
        var self = this;

        _.forEach(self._viewModelProperties, function (viewModelProperty) {
            self._eventDataSourceManager.removeDataSource(viewModelProperty.dataSourceName);
        });
    };

    ViewData.prototype.registerDataSourceListeners = function (scope) {
        var self = this;

        _.forEach(self._viewModelProperties, function (viewModelProperty) {
            if (!viewModelProperty.isValid) {
                return;
            }

            viewModelProperty.adapter.connectViewmodelToDataSource(scope, viewModelProperty.viewModel,
                viewModelProperty.dataSourceName, viewModelProperty.adaptationConfig);
        });
    };

    ViewData.prototype.updateFilters = function (newFilters) {
        var self = this;

        if (self._isUpdating) {
            return self.$q.reject("Attempted to update filters while update request is still being processed");
        }

        self._isUpdating = true;

        return self._constructionService._constructViewModelsBasedOnConfiguration(
            newFilters,
            self._dataSourceGroups,
            self._viewModelConfigs
        ).then(function (updatedViewModelProperties) {
            self._filters = newFilters;

            _.forEach(updatedViewModelProperties, function (updatedViewModelProperty) {
                var oldViewModel = self[updatedViewModelProperty.name];
                updatedViewModelProperty.adapter.overrideViewModel(oldViewModel, updatedViewModelProperty.viewModel);
            });

            self._isUpdating = false;
        });
    };

    function ViewModelProperty(name, viewModel, adapter, dataSourceName, adaptationConfig) {
        this.name = name;
        this.viewModel = viewModel;

        this.isValid = Boolean(adapter && dataSourceName);

        this.adapter = adapter;
        this.dataSourceName = dataSourceName;
        this.adaptationConfig = adaptationConfig;
    }

    function ViewDataConstructionService($q, eventDataSourceManager, widgetConfigurations, configTypes, configHelper, startingSoonConfiguration) {
        this.$q = $q;

        this.widgetConfigurations = widgetConfigurations;
        this.eventDataSourceManager = eventDataSourceManager;

        this.configTypes = configTypes;
        this.configHelper = configHelper;
        this.startingSoonConfiguration = startingSoonConfiguration;
    }

    ViewDataConstructionService.$inject = ["$q", "eventDataSourceManager", "widgetConfigurations", "configTypes", "_configHelper", "startingSoonConfiguration"];


    /* View configuration:

     interface ViewModelAdapter {
     connectViewmodelToDataSource($scope: ng.IScope, viewModel: ViewModel, dataSourceName: string);
     overrideViewModel(target: ViewModel, source: ViewModel);
     toViewModel(events: Event[], options: any): ViewModel;
     }

     interface ViewModelConfig {
     filters?: any, // The same as the filters we pass to eventDataSourceManager.createGenericEventListDataSourceFactory().
     name: string,
     adapter: ViewModelAdapter // This is the view model adapter
     configType?: ConfigTypes, // See enum below
     dataSourceName: string,
     dataSourceGroups?: string[]

     }

     interface ViewConfig {
     filters?: any, // The same as the filters we pass to eventDataSourceManager.createGenericEventListDataSourceFactory().
     dataSourceGroups?: string[],
     viewModels: ViewModelConfig[]
     }



     */

    ViewDataConstructionService.prototype.construct = function (viewConfiguration) {
        var self = this;

        var filters = viewConfiguration.filters || {};
        var dataSourceGroups = viewConfiguration.dataSourceGroups || [];

        return self._constructViewModelsBasedOnConfiguration(filters, dataSourceGroups, viewConfiguration.viewModels).then(function (viewModelProperties) {
            return new ViewData(self.$q, self, self.eventDataSourceManager, viewModelProperties, viewConfiguration.viewModels, filters, dataSourceGroups, viewModelProperties[0].adaptationConfig);
        });
    };


    ViewDataConstructionService.prototype._getDataSourceGroupsFromConfig = function (globalDataSourceGroups, viewModelConfig) {
        var viewModelDataSourceGroups = viewModelConfig.dataSourceGroups || [];

        return _(globalDataSourceGroups).concat(viewModelDataSourceGroups).value();
    };

    ViewDataConstructionService.prototype._getFiltersFromConfig = function (globalFilters, viewModelConfig) {
        var self = this;

        var filters = _.merge({}, globalFilters, viewModelConfig.filters);

        if (filters.categoryIds) {
            switch (viewModelConfig.configType) {
                case self.configTypes.LIVE:
                case self.configTypes.PREMATCH:
                    return self.widgetConfigurations.getBetGroupsForMultipleEventTables({
                        categoryIds: filters.categoryIds,
                        live: (filters.phase === 2)
                    }).then(function (betGroupIds) {
                        filters.betGroupIds = betGroupIds;

                        return filters;
                    });


                case self.configTypes.WINNER_LIST:
                    return self.$q.all(_.map(filters.categoryIds, function (categoryId) {
                        return self.widgetConfigurations.getForSection(categoryId, "winner-list");
                    })).then(function (configs) {
                        var maxLimit = _.chain(configs).pluck("limit").max().value();
                        if (maxLimit > 0) {
                            filters.eventCount = maxLimit;
                        }

                        filters.betGroupIds = _.chain(configs).map(self.configHelper.getBetGroupsFromWinnerListConfig).flattenDeep().uniq().value();

                        return filters;
                    });

                case self.configTypes.BETGROUP_COMPOSITES:
                    return self.startingSoonConfiguration.get().then(function (config) {
                        filters.betGroupIds = config.betGroupIds;

                        if (config.limit) {
                            filters.eventCount = config.limit;
                        }
                        filters.adaptationConfig = config.compositeColumns;

                        return filters;
                    });
            }
        }


        return this.$q.when(filters);
    };

    ViewDataConstructionService.prototype._constructViewModelsBasedOnConfiguration = function (globalFilters, globalDataSourceGroups, viewModelConfigs) {
        var self = this;

        return self.$q.all(
            _.map(viewModelConfigs, function (viewModelConfig) {
                var name = viewModelConfig.name;

                var adapter = viewModelConfig.adapter;
                var dataSourceName = viewModelConfig.dataSourceName;

                if (!dataSourceName || !adapter) {
                    return new ViewModelProperty(name, []);
                }

                var dataSourceGroups = self._getDataSourceGroupsFromConfig(globalDataSourceGroups, viewModelConfig);

                return self._getFiltersFromConfig(globalFilters, viewModelConfig).then(function (filters) {
                    return self.$q.all({
                        dataSource: self.eventDataSourceManager.createGenericEventListDataSource(
                            dataSourceName,
                            filters,
                            dataSourceGroups),
                        adaptationConfig: filters.adaptationConfig
                    });
                }).then(function (adaptationAndData) {
                    return self.$q.all({
                        viewModel: adapter.toViewModel(adaptationAndData.dataSource.content, adaptationAndData.adaptationConfig),
                        adaptationConfig: adaptationAndData.adaptationConfig
                    });
                }).then(function (modelAndConfig) {
                    return new ViewModelProperty(name, modelAndConfig.viewModel, adapter, dataSourceName, modelAndConfig.adaptationConfig);
                });
            })
        );
    };


    angular.module("sportsbook.markets").service("_viewDataConstructionService", ViewDataConstructionService);


    angular.module("sportsbook.markets").constant("configTypes", {
        LIVE: 0,
        PREMATCH: 1,
        WINNER_LIST: 2,
        BETGROUP_COMPOSITES: 3
    });

}(window.angular));
