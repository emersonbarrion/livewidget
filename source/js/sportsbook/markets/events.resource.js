(function (angular) {
    "use strict";

    angular
        .module('sportsbook.markets')
        .service("liveSimulationLayerService", ["lodash", function (_) {
            this.isActive = false;

            this.processStatValue = function (configuration, statValue) {
                return String(Math.round(statValue * (1 + (configuration.statsVariance * (Math.random() * 2 - 1)))));
            };

            this.makeid = function () {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }

                return text;
            };

            this.processStat = function (configuration, stat) {
                var self = this;

                _.forEach(stat, function (data) {

                    if (Math.random() < configuration.likelihoodOfStatsUpdating) {
                        data.total = self.processStatValue(configuration, data.total);
                    }

                    if (Math.random() < configuration.likelihoodOfStatsUpdating) {
                        _.forEach(_.keys(data.byPhase), function (phase) {
                            data.byPhase[phase] = self.processStatValue(configuration, data.byPhase[phase]);
                        });
                    }
                });
            };

            this.process = function (events, configuration) {
                var self = this;

                if (!this.isActive || _.isEmpty(events)) {
                    return events;
                }

                events = _.chain(events)
                    .filter(function () {
                        return Math.random() >= configuration.likelihoodOfEventRemoval;
                    })
                    .forEach(function (e) {
                        e.markets = _.chain(e.markets)
                            .filter(function () {
                                return Math.random() >= configuration.likelihoodOfMarketRemoval;
                            })
                            .forEach(function (m) {
                                if (Math.random() < configuration.likelihoodOfMarketOnHold) {
                                    m.isOnHold = true; // simulate market on hold
                                    m.status = 20;
                                }

                                _.forEach(m.selections, function (selection) {
                                    if (Math.random() < configuration.likelihoodOfOddsUpdating) {
                                        selection.odds = selection.odds * (1 + (configuration.oddVariance * (Math.random() * 2 - 1)));
                                    }
                                    selection.isOnHold = m.isOnHold;
                                });
                            }).value();

                        e.marketCount = e.markets.length;

                        if (e.scoreboard && Math.random() < configuration.likelihoodOfScoreboardUpdating) {

                            _.forEach(e.scoreboard.stats, self.processStat.bind(self, configuration));

                            self.processStat(configuration, e.scoreboard.server);
                            self.processStat(configuration, e.scoreboard.score);

                            if (e.scoreboard.matchClock) {
                                e.scoreboard.matchClock.seconds = self.processStatValue(configuration, e.scoreboard.matchClock.seconds);
                                e.scoreboard.matchClock.minutes = self.processStatValue(configuration, e.scoreboard.matchClock.minutes);
                            }

                            e.scoreboard.currentPhase.id = self.processStatValue(configuration, e.scoreboard.currentPhase.id);
                            e.scoreboard.currentPhase.text = self.makeid();
                        }
                    }).value();

                return events;
            };

            this.toggle = function () {
                this.isActive = !this.isActive;
            };
        }])
        .provider("liveSimulationLayer", [function () {
            var provider = this;

            provider.configuration = {
                likelihoodOfEventRemoval: 0.1,
                likelihoodOfMarketRemoval: 0.1,
                likelihoodOfOddsUpdating: 0.1,
                likelihoodOfStatsUpdating: 0.1,
                likelihoodOfScoreboardUpdating: 0.1,
                likelihoodOfMarketOnHold: 0.1,
                oddVariance: 0.05,
                statsVariance: 1,
            };

            provider.$get = [
                'liveSimulationLayerService',
                function (service) {
                    return {
                        setIsActive: function (isActive) {
                            service.isActive = isActive;
                        },
                        getIsActive: function () {
                            return service.isActive;
                        },
                        toggle: function () {
                            service.toggle();
                        },
                        process: function (events) {
                            return service.process(events, provider.configuration);
                        }
                    };
                }
            ];
        }])
        .service("eventsResource", ['$http', '$q', '$rootScope', "$log", "sportsbookConfiguration", "lodash", "eventsAdapter", "liveSimulationLayer", "prematchSession",
            function ($http, $q, $rootScope, $log, sportsbookConfiguration, _, adapter, liveSimulationLayer, prematchSession) {
                var self = this;

                var cancellation = $q.defer();

                $rootScope.$on("$stateChangeStart", function () {
                    cancellation.resolve();
                    cancellation = $q.defer();
                });

                var transformResponse = function (data, header, statusCode) {
                    if (statusCode !== 200) {
                        $log.error("eventsResource: query failed (code " + statusCode + ")");
                        return [];
                    }
                    return liveSimulationLayer.process(adapter.toEvent(null, angular.fromJson(data).el));
                };

                self.query = function (params, culture, loadingBar) {
                    return prematchSession.getSessionInfo().then(function (sessionInfo) {

                        params.ocb = sportsbookConfiguration.clientInterfaceIdentifier;

                        var url = [sportsbookConfiguration.services.isaUrl, sessionInfo.segmentId, culture.languageCode, "event"].join("/");
                        if (_.isEmpty(url)) {
                            return $q.reject("catalogueResource.query: 'url' was empty!");
                        }

                        return $http({
                            method: "GET",
                            cache: false,
                            url: url,
                            params: params,
                            timeout: cancellation.promise,
                            transformResponse: transformResponse,
                            ignoreLoadingBar: loadingBar
                        }).then(function (response) {
                            return response.data;
                        }).then(function (data) {
                            return _.compact(data);
                        });
                    });
                };
            }
        ]);

})(window.angular);
