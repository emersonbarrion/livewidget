(function (angular) {
    "use strict";

    /**
     * @ngdoc service
     * @name sportsbook.configuration.widgetConfigurations
     * @description Provides widget support.
     */
    function widgetConfigurations($http, $q, $log, CacheFactory, configHelper, sportsbookConfiguration, applicationState, configurationUrlsByMarket) {
        /*jshint validthis: true */
        var self = this;

        self.cacheKey = "ssk.cache.sb.widgets";

        self.$http = $http;
        self.$q = $q;
        self.$log = $log;
        self.cache = CacheFactory.get(self.cacheKey);
        self.configHelper = configHelper;
        self.sportsbookConfiguration = sportsbookConfiguration;
        self.applicationState = applicationState;
        self.configurationUrlsByMarket = configurationUrlsByMarket;
    }

    widgetConfigurations.prototype.get = function (url) {
        var self = this;

        if (_.isEmpty(url)) {
            return self.$q.reject("widgetConfigurations.get: 'url' was empty!");
        }

        return self.$http({
            "method": "GET",
            "url": url,
            "headers": {
                "Content-Type": "application/json"
            },
            cache: self.cache
        }).then(function (response) {
            return response.data;
        });
    };

    widgetConfigurations.prototype.filter = function (config, sectionName) {
        var self = this;

        var section = _.find(config, {
            "name": sectionName
        });

        if (_.isUndefined(section)) {
            throw new Error("widgetConfigurations.filter: Could not find section '" + sectionName + "'");
        }

        return section;
    };

    widgetConfigurations.prototype.getForMarket = function (marketCode) {
        var self = this;
        if (_.isUndefined(marketCode)) {
            return self.$q.reject("widgetConfigurations.getForMarket: 'marketCode' should be defined.");
        }

        var configUrl = self.configurationUrlsByMarket[marketCode] || self.configurationUrlsByMarket["default"];
        return self.get(configUrl);
    };

    widgetConfigurations.prototype.getForCategory = function (categoryId, options) {
        var self = this;
        if (_.isUndefined(categoryId)) {
            return self.$q.reject("widgetConfigurations.getForCategory: 'categoryId' should be defined.");
        }

        options = options || {};
        _.defaults(options, {
            "marketCode": null
        });

        return self.applicationState.culture().then(function (culture) {
            var marketCode = options.marketCode || culture.urlMarketCode;
            return self.getForMarket(marketCode);
        }).then(function (languageConfig) {
            return languageConfig[categoryId];
        });
    };

    widgetConfigurations.prototype.getForSection = function (categoryId, section, options) {
        var self = this;
        if (_.isUndefined(categoryId)) {
            return self.$q.reject("widgetConfigurations.getForSection: 'categoryId' should be defined.");
        }
        if (_.isUndefined(section)) {
            return self.$q.reject("widgetConfigurations.getForSection: 'section' should be defined.");
        }

        options = options || {};

        /**
         * This part here gets the 'default' config for all categories and merges it with the specific
         * one just in case there are some fields missing.
         */

        return self.getForCategory(categoryId, options).then(function (categoryConfig) {
            return self.getForCategory("default", options).then(function (defaultConfig) {
                var specificSectionConfig,
                    defaultSectionConfig,
                    error;

                try {
                    defaultSectionConfig = self.filter(defaultConfig, section);
                } catch (e) {
                    error = e.message;
                }

                try {
                    specificSectionConfig = self.filter(categoryConfig, section);
                } catch (e) {
                    error = e.message;
                }

                if (_.isUndefined(defaultSectionConfig) && _.isUndefined(specificSectionConfig)) {
                    return self.$q.reject(error);
                }

                if (_.isUndefined(specificSectionConfig)) {
                    return defaultSectionConfig;
                }

                return _.defaultsDeep(specificSectionConfig, defaultSectionConfig);
            });
        });
    };

    widgetConfigurations.prototype.getBetGroupsForWinnerLists = function (options) {
        var self = this;
        if (options.live) {
            return self.$q.when([]); //No live winner lists yet.
        }

        return self.$q.all(_.map(options.categoryIds, function (categoryId) {
            return self.getForSection(categoryId, "winner-list").then(function (config) {
                return self.configHelper.getBetGroupsFromWinnerListConfig(config);
            });
        })).then(function (betGroupsByCategory) {
            // return _.uniq(_.compact(_.flatten(betGroupsByCategory)));
            return _.chain(betGroupsByCategory).flatten().compact().uniq().value();
        });
    };

    widgetConfigurations.prototype.getBetGroupsForMultipleEventTables = function (options) {
        var self = this;

        options = options || {};

        var section = options.live ? "live-competition-section" : "competition-section";

        return self.$q.all(_.map(options.categoryIds, function (categoryId) {
            return self.getForSection(categoryId, section).then(function (config) {
                return (_.isArray(config.betGroups)) ? config.betGroups : [];
            });
        })).then(function (betGroupsByCategory) {
            // return _.uniq(_.compact(_.flatten(betGroupsByCategory)));
            return _.chain(betGroupsByCategory).flatten().compact().uniq().value();
        });
    };

    widgetConfigurations.prototype.getBetGroupsForHomepageLiveEventsTables = function (options) {
        var self = this;

        return self.$q.all(_.map(options.categoryIds, function (categoryId) {
            return self.getForSection(categoryId, "homepage-live-events-section").then(function (config) {
                return (_.isArray(config.betGroups)) ? config.betGroups : [];
            });
        })).then(function (betGroupsByCategory) {
            // return _.uniq(_.compact(_.flatten(betGroupsByCategory)));
            return _.chain(betGroupsByCategory).flatten().compact().uniq().value();
        });
    };

    widgetConfigurations.prototype.getBetGroupsForEventListPage = function (options) {
        var self = this;

        return self.getBetGroupsForMultipleEventTables(options).then(function (betGroupsPerWidget) {
            return _.chain(betGroupsPerWidget).flatten().compact().uniq().value();
        });
    };

    widgetConfigurations.prototype.getBetGroupsForHomepageStartingSoonWidget = function (options) {
        var self = this;

        options = options || {};
        options = _.defaults(options, {
            categoryIds: []
        });

        var section = "competition-section";

        return self.$q.all(_.map(options.categoryIds, function (categoryId) {
            return self.getForSection(categoryId, section).then(function (config) {
                // OSB-278
                // always take the first bet group in the category multiple events table
                // config to render the starting soon widget.
                return (_.isArray(config.betGroups) && !_.isEmpty(config.betGroups)) ? config.betGroups[0] : null;
            });
        })).then(function (betGroups) {
            return _.chain(betGroups).compact().uniq().value();
        });
    };

    angular
        .module("sportsbook.configuration")
        .service("widgetConfigurations", [
            "$http", "$q", "$log", "CacheFactory", "_configHelper", "sportsbookConfiguration", "applicationState", "configurationUrlsByMarket",
            widgetConfigurations
        ]);

})(angular);
