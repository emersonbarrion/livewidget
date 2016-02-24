(function (angular) {
    function TestUrlBuilder(sportsbookConfiguration, siteStackConfiguration, $httpParamSerializer, configurationUrlsByMarket) {
        this.sportsbookConfiguration = sportsbookConfiguration;
        this.siteStackConfiguration = siteStackConfiguration;
        this.$httpParamSerializer = $httpParamSerializer;
        this.configurationUrlsByMarket = configurationUrlsByMarket;
    }

    TestUrlBuilder.$inject = ["sportsbookConfiguration", "siteStackConfiguration", "$httpParamSerializer", "configurationUrlsByMarket"];

    TestUrlBuilder.prototype.getHomePageConfigUrl = function (urlMarketCode) {
        return this.sportsbookConfiguration.homePageConfiguration + "cfg-" + urlMarketCode + ".js";
    };

    TestUrlBuilder.prototype.getStartingSoonPageConfigUrl = function (urlMarketCode) {
        return this.sportsbookConfiguration.startingSoonConfiguration + "cfg-" + urlMarketCode + ".js";
    };

    TestUrlBuilder.prototype.getLiveLobbyConfigUrl = function (urlMarketCode) {
        return this.sportsbookConfiguration.livePageConfiguration + "cfg-" + urlMarketCode + ".js";
    };

    TestUrlBuilder.prototype.getWidgetConfigUrl = function (urlMarketCode) {
        return this.configurationUrlsByMarket[urlMarketCode];
    };

    TestUrlBuilder.prototype.getSportsbookCategoryMappingsUrl = function () {
        return this.sportsbookConfiguration.categoryMappingSource;
    };

    TestUrlBuilder.prototype.getSportsbookSearchApiUrl = function (segmentId, languageCode, filters) {
        return this.sportsbookConfiguration.services.isaUrl + ["", segmentId, languageCode, "search?"].join("/") + this.$httpParamSerializer(filters);
    };

    TestUrlBuilder.prototype.getSportsbookCategoryApiUrl = function (segmentId, languageCode, filters) {
        return this.sportsbookConfiguration.services.isaUrl + ["", segmentId, languageCode, "category?"].join("/") + this.$httpParamSerializer(filters);
    };

    TestUrlBuilder.prototype.getSportsbookBetGroupApiUrl = function (segmentId, languageCode, filters) {
        return this.sportsbookConfiguration.services.isaUrl + ["", segmentId, languageCode, "betgroup", filters.ids].join("/") + "?ocb=" + filters.ocb;
    };

    TestUrlBuilder.prototype.getSportsbookEventApiUrl = function (segmentId, languageCode, filters) {
        if (!filters) {
            filters = {};
        } else {
            filters = angular.copy(filters);

            filters.betGroupIds = (filters.betGroupIds) ? filters.betGroupIds.join(",") : null;
            filters.categoryIds = (filters.categoryIds) ? filters.categoryIds.join(",") : null;
            filters.regionIds = (filters.regionIds) ? filters.regionIds.join(",") : null;
            filters.subCategoryIds = (filters.subCategoryIds) ? filters.subCategoryIds.join(",") : null;
            filters.eventIds = (filters.eventIds) ? filters.eventIds.join(",") : null;
            filters.ocb = "TEST_CUSTOMER_ID";
        }

        return this.sportsbookConfiguration.services.isaUrl + ["", segmentId, languageCode, "event?"].join("/") + this.$httpParamSerializer(filters);
    };

    TestUrlBuilder.prototype.getSportsbookSessionInfoUrl = function () {
        return this.siteStackConfiguration.services.sessionInfo;
    };

    TestUrlBuilder.prototype.getLoginUrl = function (segmentId, sessionId) {
        var params = {
            "sessionId": sessionId,
            "segmentId": segmentId
        };
        return [this.sportsbookConfiguration.services.customerApi, "login"].join("/") + "?" + this.$httpParamSerializer(params);
    };

    TestUrlBuilder.prototype.getSportsbookBonusesUrl = function (segmentId, sessionId) {
        var params = {
            "matchType": 0,
            "Channel": 1,
            "sessionId": sessionId,
            "segmentId": segmentId
        };
        return [this.sportsbookConfiguration.services.bettingUrl, "bonus"].join("/") + "?" + this.$httpParamSerializer(params);
    };

    TestUrlBuilder.prototype.getBettingCouponPlacementUrl = function () {
        return [this.sportsbookConfiguration.services.bettingUrl, "coupon"].join("/");
    };

    TestUrlBuilder.prototype.getBettingCouponStatusUrl = function (couponGuid) {
        return [this.sportsbookConfiguration.services.bettingUrl, "couponplacementstatus", couponGuid].join("/");
    };

    angular.module("sportsbook.tests").service("testUrlBuilder", TestUrlBuilder);
})(window.angular);
