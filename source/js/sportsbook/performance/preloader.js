
(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.performance");

    /**
     * @ngdoc service
     * @name sportsbook.performance.preloaderProvider
     * @description Provider for content preloading features.
     */
    module.provider("preloader", [function () {

        /**
         * @ngdoc method
         * @name sportsbook.performance.preloaderProvider#$get
         * @methodOf sportsbook.performance.preloaderProvider
         * @description Default $get method for the preloaderProvider
         * @requires $rootScope
         * @requires $timeout
         * @requires $http
         * @requires $q
         * @requires sportsbook.application.applicationState
         * @requires sportsbook.widgets.widgetConfigurations
         * @requires sportsbook.markets.eventService
         * @requires angular-cache.CacheFactory
         */
        this.$get = ["$rootScope", "$timeout", "$http", "applicationState", "widgetConfigurations", "eventService", "CacheFactory", "$q", "sportsbookConfiguration", "$log", function ($rootScope, $timeout, $http, applicationState, widgetConfigurations, eventService, cacheFactory, $q, sportsbookConfiguration, $log) {

            var emptyRoute = {
                region: {},
                competition: {},
                event: {}
            };

            var self = {
                /**
                 * @ngdoc property
                 * @name sportsbook.performance.preloaderProvider#actioned
                 * @propertyOf sportsbook.performance.preloaderProvider
                 * @description Indicates whether preloading has been completed.
                 * @returns {boolean} A boolean indicating whether all preloadable content has been retrieved.
                 */
                actioned: false,

                /**
                 * @ngdoc method
                 * @name sportsbook.performance.preloaderProvider#load
                 * @methodOf sportsbook.performance.preloaderProvider
                 * @description Loads data for the specified route parameters.
                 * @param {Hash} parameters - A hash containing the route parameters to load.
                 */
                load: function (parameters) {

                    if (parameters.index === parameters.routes.length) {
                        self.actioned = true;
                        $rootScope.$broadcast("preload.complete");
                        return;
                    }

                    var route = angular.extend({}, emptyRoute, parameters.routes[parameters.index]);

                    // The below could probably be moved elsewhere to decouple it from sportsbook.

                    // load the configuration for the given sport.
                    widgetConfigurations.getForMarket(route.market).then(function (competitionSection) {
                        // Start loading the internal details
                        parameters.index++;
                        self.load(parameters);
                    });
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.performance.preloaderProvider#getConfiguration
                 * @methodOf sportsbook.performance.preloaderProvider
                 * @description Loads the preloading configuration.
                 * @param {Hash} parameters - A hash containing the parameters describing the required configuration.
                 * @returns {Promise} - A promise which resolves to the configuration.
                 */
                getConfiguration: function (parameters) {
                    return $http({
                        method: "GET",
                        url: sportsbookConfiguration.preloadingConfigUrl + parameters.urlMarketCode + ".js",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        cache: cacheFactory.get("ssk.cache.sb.service"),
                        timeout: 500
                    }).then(function (response) {
                        return response.data;
                    }, function (response) {
                        return (response.status === 404 && parameters.urlMarketCode !== "en") ? self.getConfiguration({
                            urlMarketCode: "en"
                        }) : $q.reject(response);
                    });
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.performance.preloaderProvider#preload
                 * @methodOf sportsbook.performance.preloaderProvider
                 * @description Starts the preloading process. If actioned has already been set to true, no further action is taken.
                 */
                preload: function () {
                    if (self.actioned) {
                        return;
                    }

                    // Trigger after the language is resolved.
                    applicationState.culture().then(function (culture) {

                        // Load the preloader configuration.
                        self.getConfiguration({
                            urlMarketCode: culture.urlMarketCode
                        }).then(function (configuration) {

                            // If we determine that the connection is slow, or we have disabled preloading,
                            // then there is nothing else to do here.
                            if (!configuration.preload) {
                                self.actioned = true;
                                $rootScope.$broadcast("preload.complete");
                            }

                            // Allow some time to elapse so we do not risk interrupting the user"s browsing.
                            $timeout(function () {
                                $log.info("Starting preloader");
                                self.load({
                                    routes: configuration.requests,
                                    index: 0
                                });
                            }, configuration.delay);
                        }, function () {

                            // If we cannot load the configuration, we treat it as a completion.
                            self.actioned = true;
                            $rootScope.$broadcast("preload.complete");
                        });
                    });
                }
            };

            return self;
        }];
    }]);
})(angular);