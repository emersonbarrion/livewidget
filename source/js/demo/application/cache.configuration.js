// This module is equivalent to the cache.configuration.js module which is being used to create cached configurations
// for any sportsbook data which will be packaged for the brand teams. Therefore, since this module should not be included
// for the brands because they are presumably building something similar themselves, this is created in a different
// file and folder so it is only packaged for within sitestack-sportsbook-demo.js .

(function (angular) {
    "use strict";

    angular.module("demo.configuration").run(["CacheFactory", function (CacheFactory) {
        var cacheName = "demo.cache.user-details";

        // This cache is used as a storage for user details used within the demo site
        if (!CacheFactory.get(cacheName)) {
            CacheFactory.createCache(cacheName, {
                maxAge: Number.MAX_VALUE,
                storageMode: "localStorage",
                onExpire: function (key) {
                   console.log("Expired key: " + key);
                }
            });
        }

    }]);
})(angular);