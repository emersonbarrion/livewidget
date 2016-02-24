(function (angular) {
    "use strict";

    angular
        .module("sportsbook.catalogue")
        .service("catalogueResource", ["$q", "$rootScope", "sportsbookConfiguration", "lodash", "catalogueAdapter", "$http", "prematchSession", "applicationState",
            function ($q, $rootScope, sportsbookConfiguration, _, catalogueAdapter, $http, prematchSession, applicationState) {

                var cancellation = $q.defer();
                var self = this;

                self.prematchSession = prematchSession;
                self.applicationState = applicationState;
                self.sportsbookConfiguration = sportsbookConfiguration;

                $rootScope.$on("$stateChangeStart", function () {
                    cancellation.resolve();
                    cancellation = $q.defer();
                });

                self.query = function (culture, phase, options) {
                    return self.prematchSession.getSessionInfo().then(function (sessionInfo) {
                        options = options || {};

                        _.defaults(options, {
                            ignoreLoadingBar: false
                        });

                        var config = _.defaultsDeep({}, sportsbookConfiguration, {
                            "services": {
                                "isaUrl": ""
                            }
                        });

                        var url = [config.services.isaUrl, sessionInfo.segmentId, culture.languageCode, "category"].join("/");
                        if (_.isEmpty(url)) {
                            return $q.reject("catalogueResource.query: 'url' was empty!");
                        }
                        return $http({
                            method: "GET",
                            cache: false,
                            url: url,
                            params: {
                                eventPhase: phase,
                                ocb: self.sportsbookConfiguration.clientInterfaceIdentifier
                            },
                            timeout: cancellation.promise,
                            ignoreLoadingBar: options.ignoreLoadingBar
                        }).then(function (response) {
                            return catalogueAdapter.toCategory(culture, response.data);
                        }).then(function (data) {
                            return _.compact(data);
                        });
                    });
                };
            }

        ]);
})(window.angular);
