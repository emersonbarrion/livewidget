
(function (angular) {
    "use strict";

    angular.module("sportsbook.configuration").config(["CacheFactoryProvider", function (CacheFactoryProvider) {

        angular.extend(CacheFactoryProvider.defaults, {
            maxAge: 3600000,
            deleteOnExpire: "aggressive",
            storageMode: "memory",
            onExpire: function (key) {
                console.log("Expired key: " + key);
            }
        });

    }]);

    angular.module("sportsbook.configuration").run(["CacheFactory", "sportsbookConfiguration", function (CacheFactory, sportsbookConfiguration) {

        // This is the current cache version number
        // Please update this if you have added any
        // new fields in the cache, to avoid crashes
        var cacheNumber = 1.2;
        var configurationVersion = sportsbookConfiguration.configurationVersion;
        var cachePrefix = sportsbookConfiguration.cachePrefix ? sportsbookConfiguration.cachePrefix : "ssk";

        var checkCacheVersion = function () {
            var cacheVersion = CacheFactory.get(cachePrefix + ".cache.sb.cacheVersion");
            if (cacheVersion && (!cacheVersion.get("cacheVersion") || cacheVersion.get("cacheVersion").version !== cacheNumber || cacheVersion.get("cacheVersion").configurationVersion !== configurationVersion)) {
                CacheFactory.clearAll();
                cacheVersion.put("cacheVersion", {
                    version: cacheNumber,
                    configurationVersion: configurationVersion
                });
            }
        };

        // Create the cache for the cache versioning
        if (!CacheFactory.get(cachePrefix + ".cache.sb.cacheVersion")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.cacheVersion", {
                maxAge: 360000,
                deleteOnExpire: "none",
                storageMode: "localStorage"
            });
        }

        // The resource cache is used by sportsbookResource.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.resource")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.resource", {
                maxAge: 60000
            });
        }

        // Page cache is used by sportsbookResource SEO resources.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.resource.page")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.resource.page");
        }

        // The category cache is used by catalogueService for prematch categories.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.catalogue")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.catalogue");
        }

        // The live category cache is used by catalogueService for live categories.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.catalogue.live")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.catalogue.live", {
                maxAge: 20000
            });
        }

        // The service cache is used for the session info.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.service.session")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.service.session", {
                maxAge: 60 * 60 * 1000,
                storageMode: "memory"
            });
        }

        // The service cache is used by sportsbookService.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.service")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.service", {
                maxAge: 300000
            });
        }

        // The service cache is used when retrieving winner list data.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.service.winnerList")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.service.winnerList", {
                maxAge: 300000
            });
        }

        // The service cache is used by sportsbookService for user details (for example bet history).
        if (!CacheFactory.get(cachePrefix + ".cache.sb.service.user")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.service.user", {
                maxAge: 60000,
                storageMode: "sessionStorage"
            });
        }

        // This cache is used as a general storage for user settings
        if (!CacheFactory.get(cachePrefix + ".cache.sb.user-settings")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.user-settings", {
                maxAge: Number.MAX_VALUE,
                storageMode: "localStorage"
            });
        }

        // The widget cache is used by the widgetService.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.widgets")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.widgets", {
                storageMode: "localStorage"
            });
        }


        // The widget cache is used by the widgetService.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.bonuses")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.bonuses", {
                maxAge: 5000,
                storageMode: "localStorage"
            });
        }

        // The widget cache is used by the homePageConfiguration service.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.homepage")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.homepage", {
                storageMode: "localStorage"
            });
        }

        // The widget cache is used by the routingConfigurations.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.routing")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.routing", {
                storageMode: "localStorage"
            });
        }

        // The culture cache is used by the cultureService.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.culture")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.culture");
        }

        // The multi-view data competition cache is used by the multi-viewDataService to cache competition data.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.multi-view.data.competition")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.multi-view.data.competition", {
                maxAge: 300000
            });
        }

        // The multi-view data configuration cache is used by the multi-viewDataService to cache configuration data.
        if (!CacheFactory.get(cachePrefix + ".cache.sb.multi-view.data.configuration")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.multi-view.data.configuration");
        }

        // The statistics data retrieved from third parties
        if (!CacheFactory.get(cachePrefix + ".cache.sb.statistics")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.statistics");
        }

        // The cache for the market promotion banner service
        if (!CacheFactory.get(cachePrefix + ".cache.sb.promotions.market-promotion")) {
            CacheFactory.createCache(cachePrefix + ".cache.sb.promotions.market-promotion", {
                maxAge: 60 * 60e3, // 60 mins
                storageMode: "memory"
            });
        }

        // Check the cache version
        checkCacheVersion();

    }]);
})(angular);
