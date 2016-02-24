(function (angular) {
    "use strict";

    var CACHE_NAME = "ssk.cache.sb.service.session";
    var module = angular.module("sportsbook.session");

    module.service("prematchSession", ["siteStackConfiguration", "sportsbookConfiguration", "$http", "CacheFactory", "applicationState", "$log", "$q", "emptyToken", function (siteStackConfiguration, sportsbookConfiguration, $http, CacheFactory, applicationState, $log, $q, emptyToken) {
        var self = this;
        var cache = CacheFactory.get(CACHE_NAME);

        self.getSessionInfo = function () {

            // Check if we already have cached the sessionInfo
            // to avoid making unnecessary calls to the API
            if (cache.get(CACHE_NAME)) {
                var cachedSessionInfo = cache.get(CACHE_NAME);
                return $q.when(cachedSessionInfo);
            }

            return applicationState.culture().then(function (culture) {

                return $http({
                    method: "POST",
                    url: siteStackConfiguration.services.sessionInfo,
                    withCredentials: true,
                    data: {
                        siteMarket: culture.urlMarketCode
                    },
                }).then(function (response) {
                    var data = response.data;
                    cache.put(CACHE_NAME, data);

                    return {
                        segmentId: data.segmentId,
                        token: data.token
                    };
                }).then(function (sessionInfo) {
                    if (sessionInfo.token === emptyToken) {
                        return sessionInfo;
                    }
                    return $http({
                        "method": "GET",
                        "url": [sportsbookConfiguration.services.customerApi, "login"].join("/"),
                        "params": {
                            "segmentId": sessionInfo.segmentId,
                            "sessionId": sessionInfo.token
                        },
                        "cache": false
                    }).then(function (loginResponse) {
                        $log.debug("Customer api login", loginResponse);
                        return sessionInfo;
                    }, function (err) {
                        return err;
                    });


                });
            });
        };

        self.invalidateCache = function () {
            var cache = CacheFactory.get(CACHE_NAME);

            if (cache) {
                cache.removeAll();
            }
        };

        applicationState.user.subscribe(function (oldValue, newValue) {

            if (!oldValue) {
                return;
            }

            self.invalidateCache();
        }, false);

        applicationState.culture.subscribe(function (oldValue, newValue) {

            if (!oldValue) {
                return;
            }

            self.invalidateCache();
        }, false);

    }]);

}(window.angular));
