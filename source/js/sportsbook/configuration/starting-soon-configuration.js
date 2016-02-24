(function (angular) {
    'use strict';

    var module = angular.module('sportsbook.configuration');

    module.service("startingSoonConfiguration", [
        "$http",
        'lodash',
        "CacheFactory",
        "sportsbookConfiguration",
        "applicationState",
        "$log",
        function ($http, _, CacheFactory, sportsbookConfiguration, applicationState, $log) {
            var self = this;
            var defaultMarket = "en";

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

                if (_.isEmpty(sportsbookConfiguration.startingSoonConfiguration)) {
                    $log.warn("startingSoonConfiguration.getByMarket: sportsbookConfiguration.startingSoonConfiguration was empty!");
                }

                var betgroupCompositesConfigurationLocation = sportsbookConfiguration.startingSoonConfiguration || "";
                var configurationKey = "cfg-" + options.market;
                var url = betgroupCompositesConfigurationLocation + configurationKey + ".js";

                return $http({
                    method: "GET",
                    url: url,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    cache: CacheFactory.get("ssk.cache.sb.betGroupComposites"),
                    "ignoreLoadingBar": true
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