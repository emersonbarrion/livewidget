(function (angular) {
    'use strict';

    var module = angular.module('sportsbook.configuration');

    /**
     * @ngdoc service
     * @name sportsbook.configuration.livePageConfigurations
     * @requires $http
     * @requires lodash
     * @requires CacheFactory
     * @requires sportsbook.sportsbookConfiguration
     */
    module.service("livePageConfigurations", ["$http", 'lodash', "CacheFactory", "sportsbookConfiguration", "applicationState", "$log", function ($http, _, CacheFactory, sportsbookConfiguration, applicationState, $log) {

        var self = this;
        var defaultMarket = "en";

        /**
         * @ngdoc method
         * @name sportsbook.configuration.livePageConfigurations#get
         * @methodOf sportsbook.configuration.livePageConfigurations
         * @description Return configuration for given config.
         */
        self.get = function () {
            return applicationState.culture().then(function (culture) {
                return self.getByMarket({
                    market: culture.urlMarketCode
                });
            });
        };

        self.getByMarket = function (options) {
            options = options || {};

            options = _.defaults(options, {
                "market": defaultMarket
            });

            if (_.isEmpty(sportsbookConfiguration.livePageConfiguration)) {
                $log.warn("livePageConfigurations.getByMarket: sportsbookConfiguration.livePageConfiguration was empty!");
            }

            var livePageConfigurationLocation = sportsbookConfiguration.livePageConfiguration || "";
            var configurationKey = "cfg-" + options.market;
            var url = livePageConfigurationLocation + configurationKey + ".js";

            return $http({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                cache: CacheFactory.get("ssk.cache.sb.homepage")
            }).then(function (response) {
                return response.data;
            }, function (response) {

                if (response.status === 404 && options.market !== defaultMarket) {
                    $log.warn("Unable to load configuration '" + configurationKey + "'. Attempting to load default configuration instead.");

                    return self.getByMarket({
                        market: defaultMarket
                    });
                }

                return undefined;
            });
        };
    }]);

})(angular);