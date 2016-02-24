(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.translate');

    module.factory('translate.rest.loader', ['$q', '$http', 'sitestackApiConfig', 'siteStackConfiguration',
        function ($q, $http, sitestackApiConfig, siteStackConfiguration) {

            return function (options) {
                // Wait until we have a market, then hit the translations.
                return sitestackApiConfig.urlFor({ path: siteStackConfiguration.translateRestLoader }).then(function (url) {
                    var deferred = $q.defer();

                    $http(angular.extend({
                        url: url,
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: options.bundles
                    }, options.$http)).success(function (data) {
                        deferred.resolve(data);
                    }).error(function () {
                        deferred.reject(options.key);
                    });

                    return deferred.promise;
                });
            };
        }
    ]);

}(window.angular));
