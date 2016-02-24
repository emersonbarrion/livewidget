(function(angular) {
    "use strict";

    var module = angular.module('sportsbook.content');

    // declare the default ContentServiceClass class
    var ContentServiceClass = function(sportsbookPage) {
        // store the injected dependencies
        this.sportsbookPage = sportsbookPage;
    };

    /**
     * @ngdoc method
     * @name sportsbook.content:contentService#getCategory
     * @methodOf sportsbook.content:contentService
     * @param {object} options - The request parameters.
     * @description Returns the category prematch items
     */
    ContentServiceClass.prototype.getPageContent = function(options) {
        var typeName = (!options.event) ? "landingpages" : "eventpages";

        return this.sportsbookPage.get({
            language: options.market,
            typeName: typeName,
            categoryId: options.categoryId,
            regionId: options.regionId,
            competitionId: options.competitionId,
            eventId: options.eventId
        }).$promise;
    };

    /**
     * @ngdoc service
     * @name sportsbook.content:contentService
     * @description Content factory to be consumed by the ContentProvider
     */
    module.service("contentService", ['sportsbookPage', ContentServiceClass]);
}(window.angular));
