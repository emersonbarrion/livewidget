
(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.promotions");

    module.factory("marketPromotionResource", ["$resource", "$q", "$rootScope", "sitestackApiConfig",
        function ($resource, $q, $rootScope, sitestackApiConfig) {

            var resourceUrlTemplate = sitestackApiConfig.url + "/:language/:version/promotions/:area/";
            var cancellation = $q.defer();

            $rootScope.$on("$stateChangeStart", function () {
                cancellation.resolve();
                cancellation = $q.defer();
            });

            return $resource(resourceUrlTemplate, {
                "version": sitestackApiConfig.version
            }, {
                "get": {
                    "method": "GET",
                    "isArray": false,
                    "withCredentials": true,
                    "timeout": cancellation
                }
            });

        }
    ]);

})(window.angular);
