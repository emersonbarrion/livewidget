
(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.statistics");

    var API_DATE_FORMAT = "yyyy-MM-dd HH:mm";
    var MOMENT_DATE_FORMAT = "YYYY-MM-DD HH:mm";

    /**
     * @ngdoc service
     * @name sportsbook.statistics.statistics
     * @description
     * Service to retrive the statistics for events using the statictics API.
     */
    var StatisticsServiceClass = function ($q, $http, CacheFactory, sportsbookConfiguration, statisticsAdapter, applicationState, $rootScope) {
        // store the injected dependencies
        var self = this;

        self.$q = $q;
        self.$http = $http;
        self.CacheFactory = CacheFactory;
        self.sportsbookConfiguration = sportsbookConfiguration;
        self.adapter = statisticsAdapter;
        self.applicationState = applicationState;

        self.cancellation = $q.defer();

        $rootScope.$on("$stateChangeStart", function () {
            self.cancellation.resolve();
            self.cancellation = $q.defer();
        });

        // cache keys
        self.cache = CacheFactory.get("ssk.cache.sb.statistics");
    };

    /**
     * @ngdoc method
     * @name getTable
     * @methodOf sportsbook.statistics.statistics
     * @description
     * Returns the league table
     *
     * @param {(string|number)} competition - The external id for the competition
     * @param {object=} options - The request parameters.
     * @param {string=} options.fields - Comma-separated list of fields to retrieve.
     * @param {string=} options.participants - Comma-separated list of participants to retrieve.
     */
    StatisticsServiceClass.prototype.getTable = function (competition, options) {
        var self = this;
        var sportsbookConfig = self.sportsbookConfiguration;

        competition = Number(competition);
        if (_.isNaN(competition)) {
            throw new Error("Statistics Service: getTable expects a valid competition ID and a optional options parameter");
        }

        options = options || {};

        // when the application culture has resolved
        return self.applicationState.culture().then(function (culture) {
            // cache the retrieved data
            var url = [sportsbookConfig.statistics.serviceUrl, 'tables', sportsbookConfig.statistics.partner, competition, culture.threeLetterLanguageCode, "0.json"].join("/");
            return self.$http.get(url, {
                cache: self.cache,
                timeout: self.cancellation,
                headers: {
                    'API_KEY': sportsbookConfig.statistics.apiKey
                },
                params: {
                    dateFormat: API_DATE_FORMAT,
                    tz: culture.timeZone,
                    fields: options.fields,
                    participants: options.participants
                }
            }).then(function (response) {
                return self.adapter.toTable(response.data, MOMENT_DATE_FORMAT);
            }, function (error) {
                return null;
            });
        });
    };

    /**
     * @ngdoc method
     * @name getHeadToHead
     * @methodOf sportsbook.statistics.statistics
     * @description
     * Returns the past head-to-head encounters between the two participants
     *
     * @param {number} count - The number of events to return
     * @param {object=} options - The request parameters.
     * @param {string=} options.participants - Commas-separated external ids for the partcipants
     */
    StatisticsServiceClass.prototype.getHeadToHead = function (count, options) {
        var self = this;
        var sportsbookConfig = self.sportsbookConfiguration;

        count = Number(count);
        if (_.isNaN(count)) {
            throw new Error("Statistics Service: getHeadToHead expects a valid count parameter and a optional options parameter");
        }

        options = options || {};

        // when the application culture has resolved
        return self.applicationState.culture().then(function (culture) {
            // cache the retrieved data
            var url = [sportsbookConfig.statistics.serviceUrl, 'head2head', sportsbookConfig.statistics.partner, culture.threeLetterLanguageCode, count, ".json"].join("/");

            return self.$http.get(url, {
                cache: self.cache,
                timeout: self.cancellation,
                headers: {
                    'API_KEY': sportsbookConfig.statistics.apiKey
                },
                params: {
                    dateFormat: API_DATE_FORMAT,
                    tz: culture.timeZone,
                    participants: options.participants
                }
            }).then(function (response) {
                return self.adapter.toEvents(response.data, MOMENT_DATE_FORMAT);
            }, function (error) {
                return null;
            });
        });
    };

    /**
     * @ngdoc method
     * @name getFixtures
     * @methodOf sportsbook.statistics.statistics
     * @description
     * Returns the upcoming and past fixtures for the two participants
     *
     * @param {string|number} competition - The external id for the competition
     * @param {number} offset - 0, -1...etc for past events; 1, 2...etc for future events; offset by the count parameter
     * @param {number} count - Number of results to return for each participant
     * @param {object=} options - The request parameters.
     * @param {string=} options.participants - Commas-separated external ids for the partcipants
     * @param {number=} options.adv - Filter by all (0), home (1) or away (-1)
     */
    StatisticsServiceClass.prototype.getFixtures = function (competition, offset, count, options) {
        var self = this;
        var sportsbookConfig = self.sportsbookConfiguration;

        competition = Number(competition);
        if (_.isNaN(competition)) {
            throw new Error("Statistics Service: getFixtures expects a valid competition ID as the first parameter");
        }

        offset = Number(offset);
        if (_.isNaN(offset)) {
            throw new Error("Statistics Service: getFixtures expects a valid offset as the second parameter");
        }

        count = Number(count);
        if (_.isNaN(count)) {
            throw new Error("Statistics Service: getFixtures expects a valid count as the third parameter");
        }

        options = options || {};

        // when the application culture has resolved
        return self.applicationState.culture().then(function (culture) {
            // cache the retrieved data
            var url = [sportsbookConfig.statistics.serviceUrl, 'fixtures', sportsbookConfig.statistics.partner, competition, culture.threeLetterLanguageCode, offset, count, ".json"].join("/");

            return self.$http.get(url, {
                cache: self.cache,
                timeout: self.cancellation,
                headers: {
                    'API_KEY': sportsbookConfig.statistics.apiKey
                },
                params: {
                    dateFormat: API_DATE_FORMAT,
                    tz: culture.timeZone,
                    participant: options.participants,
                    adv: options.adv
                }
            }).then(function (response) {
                return self.adapter.toParticipants(response.data, MOMENT_DATE_FORMAT);
            }, function (error) {
                return null;
            });
        });
    };

    /**
     * @ngdoc method
     * @name getStandings
     * @methodOf sportsbook.statistics.statistics
     * @description
     * Returns the positions of the two participants in the respective league tables
     *
     * @param {string|number} competition - The external id for the competition
     * @param {object=} options - The request parameters.
     * @param {string=} options.participants - Commas-separated external ids for the partcipants
     */
    StatisticsServiceClass.prototype.getStandings = function (competition, options) {
        var self = this;

        competition = Number(competition);
        if (_.isNaN(competition)) {
            throw new Error("Statistics Service: getTable expects a valid competition ID and a optional options parameter");
        }

        options = options || {};

        return self.getTable(competition, options);
    };

    module.service("statistics", ["$q", "$http", "CacheFactory", "sportsbookConfiguration", "statisticsAdapter", "applicationState", "$rootScope", StatisticsServiceClass]);

})(window.angular);
