
(function (angular) {
    "use strict";

    angular
        .module('sportsbook.configuration')
        .service("catalogueMappingResource", ['CacheFactory', '$q', '$rootScope', "sportsbookConfiguration", "$http",
            function (cacheFactory, $q, $rootScope, sportsbookConfiguration, $http) {

                var cache = cacheFactory.get("ssk.cache.sb.catalogue");
                var cancellation = $q.defer();

                $rootScope.$on("$stateChangeStart", function () {
                    cancellation.resolve();
                    cancellation = $q.defer();
                });

                this.query = function () {
                    sportsbookConfiguration = _.defaultsDeep(sportsbookConfiguration, {
                        "categoryMappingSource": ""
                    });
                    var url = sportsbookConfiguration.categoryMappingSource;
                    if (_.isEmpty(url)) {
                        return $q.reject("catalogueMappingResource.query: 'url' was empty!");
                    }
                    return $http({
                        method: "GET",
                        cache: cache,
                        url: sportsbookConfiguration.categoryMappingSource,
                        timeout: cancellation.promise
                    }).then(function (response) {
                        return response.data;
                    }).then(function (data) {
                        return data;
                    });
                };
            }
        ]);
})(window.angular);