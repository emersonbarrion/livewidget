
(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.content");

    module.factory("sportsbookPage", ["$resource", "sitestackApiConfig", "CacheFactory", "$q", "$rootScope", "$log",
        function ($resource, sitestackApiConfig, cacheFactory, $q, $rootScope, $log) {

            var cancellation = $q.defer();

            $rootScope.$on("$stateChangeStart", function () {
                cancellation.resolve();
                cancellation = $q.defer();
                $log.info("Cancelled request");
            });

            return $resource(sitestackApiConfig.url + "/:language/:version/pages/:typeName/:categoryId/:regionId/:competitionId/:eventId", {
                version: sitestackApiConfig.version
            }, {}, {
                cache: cacheFactory.get("ssk.cache.sb.resource.page"),
                timeout: cancellation.promise
            });
        }
    ]);

}(window.angular));
