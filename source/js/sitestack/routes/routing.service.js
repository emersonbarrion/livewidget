(function(angular) {
    "use strict";

    var module = angular.module("angular-sitestack-application");

    // ReSharper disable once InconsistentNaming
    /**
     * @ngdoc service
     * @name sportsbook.routing:routingService
     * @description Provides routing support.
     */
    module.service("routingService", ["$http", "$log", "lodash", "CacheFactory", "siteStackConfiguration", function($http, $log, lodash, CacheFactory, siteStackConfiguration) {

        var self = this;
        var defaultMarket = "en";

        /**
         * @ngdoc method
         * @name sportsbook.routing:routingService#get
         * @methodOf sportsbook.routing:routingService
         * @param {object} options.culture - The culture to localize the configuration for.
         * @param {object} options.key - The key to look up.
         * @description Return one or more configuration sections.
         */
        self.get = function(options) {
            if (lodash.isUndefined(options)){
                throw "Options should be defined";
            }

            return self.getByMarket({
                market: options.urlMarketCode,
                key: options.key,
            });
        };

        self.getByMarket = function(options) {
            var market = options.market;

            var configurationKey = "cfg-" + market + "-" + options.key;

            return $http({
                method: "GET",
                url: siteStackConfiguration.routingConfiguration + configurationKey + ".js",
                headers: {
                    "Content-Type": "application/json"
                },
                cache: CacheFactory.get("ssk.cache.sb.routing")
            }).then(function(response) {
                if (response.data) {
                    return response.data;
                }
                return undefined;
            }, function(response) {

                if (response.status === 404 && market !== defaultMarket) {
                    $log.warn("Unable to load configuration '" + configurationKey + "'. Attempting to load default configuration instead.");

                    return self.getByMarket({
                        market: defaultMarket,
                        key: options.key
                    });
                }

                return undefined;
            }).catch(function(e) {
                $log.error(e);
            });
        };

        return self;
    }]);

})(angular);
