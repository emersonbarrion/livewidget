(function (angular) {
    "use strict";

    var sportsbookService = angular.module('sportsbook.configuration');

    /**
     * @ngdoc service
     * @name sportsbook.configuration.sportsbookConfiguration
     * @description
     * The main sportsbook configuration service.
     */
    sportsbookService.provider('sportsbookConfiguration', function () {
        this.config = {
            'preloadingConfigUrl': "/templates/config/preloading/",
            'widgetConfiguration': "/templates/config/",
            'templates': {
                'winnerListWidget': '/templates/sportsbook/winner-list/winner-list-widget.html',
                'headToHeadListWidget': '/templates/sportsbook/winner-list/head-to-head-list-widget.html',
                'winnerListSection': '/templates/sportsbook/winner-list/winner-list-section.html',
                'betHistory': '/templates/sportsbook/bethistory/bet-history.html',
                'betHistoryButton': '/templates/sportsbook/bethistory/bet-history-button.html',
                'betSlip': '/templates/sportsbook/bets/bet-slip.html',
                'manualAttest': '/templates/sportsbook/bets/manual-attest.html',
                'catalogueList': '/templates/sportsbook/catalogue/catalogue-list.html',
                'odds': '/templates/sportsbook/directives/bsn-odds.html',
                'multipleEventsTable': '/templates/sportsbook/events-table/multiple-events-table.html',
                'search': '/templates/sportsbook/search/search.html',
                'searchResultWidget': '/templates/sportsbook/views/search-result-widget.html',
                'statisticsEvent': '/templates/sportsbook/statistics/statistics.html',
                'statisticsTable': '/templates/sportsbook/statistics/statistics.table.html',
                'statisticsHeadToHead': '/templates/sportsbook/statistics/statistics.headToHead.html',
                'statisticsFixtures': '/templates/sportsbook/statistics/statistics.fixtures.html',
                'statisticsStandings': '/templates/sportsbook/statistics/statistics.standings.html'
            },
            'services': {
                'proxyUrl': "",
                'bettingUrl': "",
                'isaUrl': ""
            },
            'statistics': {
                'serviceUrl': "",
                'apiKey': "",
                'partner': ""
            }
        };

        this.$get = function () {
            return this.config;
        };
    });


    /**
     * @ngdoc service
     * @name sportsbook.configuration.apiConfig
     * @description Provides common information related to the web api, such as name-id mappings, version and url.
     * @requires angular-sitestack-application.applicationState
     * @requires $q
     * @requires sportsbook.configuration.sportsbookConfiguration
     */
    sportsbookService.service('apiConfig', ['applicationState', '$q', 'sportsbookConfiguration',
        function (applicationState, $q, sportsbookConfiguration) {
            var self = this;

            /**
             * @ngdoc property
             * @name sportsbook.configuration.apiConfig#version
             * @propertyOf sportsbook.configuration.apiConfig
             * @description Specifies the version of the web api which the application will communicate with.
             * @returns {number} The version number for the web api.
             */
            self.version = 1;

            /**
             * @ngdoc property
             * @name sportsbook.configuration.apiConfig#url
             * @propertyOf sportsbook.configuration.apiConfig
             * @description Specifies the url of the web api which the application will communicate with. The url is set at build time using the api-url substitution in grunt.
             * @returns {string} The url for the web api.
             */
            self.url = sportsbookConfiguration.services.proxyUrl; // "http://api-v0.sportsbook.betsson.sitestack.mylocal/";

            self.directUrl = sportsbookConfiguration.services.bettingUrl; // "http://srvmtphxdev03/BettingWebApi/api";

            self.favoritesUrl = sportsbookConfiguration.services.favoritesApi; // "http://srvmtphxdev03:4435/CustomerFavoritesApi/api/favoritesubcategories/";

            /**
             * @ngdoc method
             * @name sportsbook.configuration.apiConfig#urlFor
             * @methodOf sportsbook.configuration.apiConfig
             * @description Returns a promise for a path, which is based on the api URL, the active language and the api version.
             * @param {object} options - Options describing the requested url.
             * @param {string} options.path - The relative path for the url.
             * @param {string} options.urlMarketCode - The market code, which is the top level path for the url.
             * @returns {Promise} A promise which resolves to the absolute url for the given path.
             */
            self.urlFor = function (options) {

                if (options.urlMarketCode) {
                    return $q.when(self._buildUrl(options.path, options.urlMarketCode));
                } else {
                    return applicationState.culture().then(function (culture) {
                        return self._buildUrl(options.path, culture.urlMarketCode);
                    });
                }
            };

            self._buildUrl = function (path, language) {
                return self.url + "/" + language + "/" + self.version + path;
            };

            self.directUrlFor = function (options) {
                return $q.when(this.directUrl + options.path);
            };

            self.favoritesUrlFor = function (options) {
                return $q.when(this.favoritesUrl + options.path);
            };
        }
    ]);

})(angular);
