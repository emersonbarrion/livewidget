(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.search");
    /**
     * @ngdoc service
     * @name sportsbook.search:SearchService
     * @description Provides search functionality.
     */
    var SearchServiceClass = function ($http, cacheFactory, sportsbookConfiguration, applicationState, prematchSession, $log) {
        // store the injected dependencies
        this.$http = $http;
        this.cacheFactory = cacheFactory;
        this.sportsbookConfiguration = sportsbookConfiguration;
        this.applicationState = applicationState;
        this.prematchSession = prematchSession;
        this.$log = $log;
    };

    /**
     * @ngdoc method
     * @name sportsbook.search:SearchService#search
     * @methodOf sportsbook.search:SearchService
     * @param {object} options - Describes the search request.
     * @param {string} options.text - The text to search the participants by.
     * @description Returns a list of participants and the markets in which they are found in.
     */
    SearchServiceClass.prototype.search = function (options) {
        var self = this;
        return self.prematchSession.getSessionInfo().then(function (sessionInfo) {
            return self.applicationState.culture().then(function (culture) {
                return self.$http({
                    method: "GET",
                    url: self.sportsbookConfiguration.services.isaUrl + "/" + sessionInfo.segmentId + "/" + culture.languageCode + "/search",
                    params: {
                        searchText: encodeURIComponent(options.text),
                        ocb: self.sportsbookConfiguration.clientInterfaceIdentifier
                    },
                    cache: self.cacheFactory.get("ssk.cache.sb.service")
                }).then(function (data) {
                    self.$log.debug("search service data", data);
                    return data;
                });
            });
        });
    };

    /**
     * @ngdoc service
     * @name sportsbook.search:searchService
     * @description Search service factory to be used for searching within the participants
     */
    module.service("searchService", ["$http", "CacheFactory", "sportsbookConfiguration", "applicationState", "prematchSession", "$log", SearchServiceClass]);

}(window.angular));
