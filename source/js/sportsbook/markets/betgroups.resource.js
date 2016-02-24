(function (angular) {
    "use strict";

    angular
        .module('sportsbook.markets')
        .service("betGroupsResource", ['$http', 'CacheFactory', '$q', '$rootScope', "sportsbookConfiguration", "lodash", "prematchSession",
            function ($http, cacheFactory, $q, $rootScope, sportsbookConfiguration, _, prematchSession) {
                var self = this;
                self.cacheFactory = cacheFactory;
                self.sportsbookConfiguration = sportsbookConfiguration;
                self.prematchSession = prematchSession;

                self.query = function (params, culture) {

                    return prematchSession.getSessionInfo().then(function (sessionInfo) {
                        var url = [self.sportsbookConfiguration.services.isaUrl, sessionInfo.segmentId, culture.languageCode, "betgroup", params.ids].join("/");
                        var cancellation = $q.defer();

                        $rootScope.$on("$stateChangeStart", function () {
                            cancellation.resolve();
                            cancellation = $q.defer();
                        });
                        return $http({
                            method: "GET",
                            isArray: true,
                            cache: cacheFactory.get("ssk.cache.sb.service.events"),
                            url: url,
                            timeout: cancellation,
                            params: {
                                "ocb": self.sportsbookConfiguration.clientInterfaceIdentifier
                            },
                            transformResponse: function (data) {
                                return _.map(angular.fromJson(data), function (definition) {
                                    return {
                                        "betGroupId": definition.bgi,
                                        "name": definition.bgn
                                    };
                                });
                            }
                        }).then(function (response) {
                            return response.data;
                        });
                    });

                };

            }
        ]);
})(window.angular);
