(function (angular) {
    angular.module("sportsbook.tests").constant("testMarkets", {
        english: {
            id: 601,
            languageCode: "en",
            urlMarketCode: "en"
        }
    });

    angular.module("sportsbook.tests").config(["$provide", "testMarkets", "sportsbookConfigurationProvider", "siteStackConfigurationProvider",
        function ($provide, testMarkets, sportsbookConfigurationProvider, siteStackConfigurationProvider) {
            sportsbookConfigurationProvider.config = {
                "cachePrefix": "ssk",
                "services": {
                    "isaUrl": "http://isaUrl.test.com",
                    "customerApi": "http://customerApi.test.com",
                    "proxyUrl": "http://proxy.test.com",
                    "bettingUrl": "http://betting.test.com"
                },
                "categoryMappingSource": "/configs/category-mappings.js",
                "widgetConfiguration": "/configs/",
                "livePageConfiguration": "/configs/livelobby/",
                "homePageConfiguration": "/configs/homelobby/",
                "clientInterfaceIdentifier": "TEST_CUSTOMER_ID",
                "startingSoonConfiguration": "/configs/startingsoon/"
            };

            $provide.constant("initialTestMarket", testMarkets.english);
        }
    ]);
})(window.angular);
