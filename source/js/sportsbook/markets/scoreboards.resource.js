(function (angular) {
    "use strict";

    angular
        .module('sportsbook.markets')
        .service("scoreboardsResource", [
            '$http', 'CacheFactory', '$q', '$rootScope', "sportsbookConfiguration", "lodash", "scoreboardsAdapter", "prematchSession",
            function ($http, cacheFactory, $q, $rootScope, sportsbookConfiguration, _, adapter, prematchSession) {
                var self = this;
                self.$http = $http;
                self.adapter = adapter;
                self.cacheFactory = cacheFactory;
                self.prematchSession = prematchSession;
                self.sportsbookConfiguration = sportsbookConfiguration;

                self.query = function (params, culture) {
                    return self.prematchSession.getSessionInfo().then(function (sessionInfo) {

                        var url = [self.sportsbookConfiguration.services.isaUrl, sessionInfo.segmentId, culture.languageCode, "scoreboard"].join("/");

                        params.ocb = self.sportsbookConfiguration.clientInterfaceIdentifier;
                        var cancellation = $q.defer();

                        $rootScope.$on("$stateChangeStart", function () {
                            cancellation.resolve();
                            cancellation = $q.defer();
                        });

                        return self.$http({
                            method: "GET",
                            cache: cacheFactory.get("ssk.cache.sb.service.events"),
                            url: url,
                            params: params,
                            timeout: cancellation,
                            transformResponse: function (data) {
                                return adapter.toScoreboard(angular.fromJson(data));
                            }
                        }).then(function (response) {
                            return response.data;
                        });
                    });
                };
            }
        ]);
})(window.angular);
