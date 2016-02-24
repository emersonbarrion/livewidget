(function(angular) {
    "use strict";

    var CultureServiceClass = (function() {

        var dependencies = {};

        // declare the default CultureServiceClass class
        function CultureServiceClass($q, $http, sitestackApiConfig, cacheFactory) {

            // store the injected dependencies
            dependencies.$http = $http;
            dependencies.sitestackApiConfig = sitestackApiConfig;
            dependencies.cacheFactory = cacheFactory;

            // cache keys
            this.cache = cacheFactory.get("ssk.cache.sb.culture");
        }
        CultureServiceClass.$inject = ["$q", "$http", "sitestackApiConfig", "CacheFactory"];

        /**
         * @ngdoc method
         * @name angular-sitestack-culture.cultureService#getCulture
         * @methodOf angular-sitestack-culture.cultureService
         * @description Returns the site market culture.
         */
        CultureServiceClass.prototype.getCulture = function (urlMarketCode) {
            var sitestackApiConfig = dependencies.sitestackApiConfig;
            var $http = dependencies.$http;

            var self = this;
            return sitestackApiConfig.urlFor({
                path: "/site-market",
                urlMarketCode: urlMarketCode
            }).then(function (url) {
                return $http({
                    method: 'GET',
                    url: url,
                    cache: self.cache
                }).then(function (response) {
                    return response.data;
                });
            });
        };

        return CultureServiceClass;
    }());

    /**
     * @ngdoc service
     * @name angular-sitestack-culture.cultureService
     * @description culture factory to be consumed by the cultureProvider
     */
    angular.module('angular-sitestack-culture').service("cultureService", CultureServiceClass);
}(window.angular));
