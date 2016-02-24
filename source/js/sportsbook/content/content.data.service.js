(function(angular) {
    "use strict";

    var ContentDataServiceClass = (function() {

        function ContentDataServiceClass($q, $stateParams, applicationState, contentService) {

            var self = this;

            self.getSeoContentForLanguageLobby = function() {
                return applicationState.culture()
                    .then(function(culture) {
                        return contentService.getPageContent({
                            market: culture.urlMarketCode
                        }).then(function(data) {
                            return {
                                culture: culture,
                                data: data
                            };
                        });
                    });
            };

            self.getSeoContentForCategoryLobby = function() {
                return $q.all({
                    culture: applicationState.culture(),
                    category: applicationState.category()
                }).then(function (values) {
                    return contentService.getPageContent({
                        market: values.culture.urlMarketCode,
                        categoryId: values.category.id
                    }).then(function (data) {
                        return {
                            culture: values.culture,
                            category: values.category,
                            data: data
                        };
                    });
                });
            };

            self.getSeoContentForRegionLobby = function() {
                return $q.all({
                    culture: applicationState.culture(),
                    category: applicationState.category(),
                    region: applicationState.region()
                }).then(function(values) {
                    return contentService.getPageContent({
                        market: values.culture.urlMarketCode,
                        categoryId: values.category.id,
                        regionId: values.region.id
                    }).then(function(data) {
                        return {
                            culture: values.culture,
                            category: values.category,
                            region: values.region,
                            data: data
                        };
                    });
                });
            };

            self.getSeoContentForCompetitionLobby = function() {
                return $q.all({
                    culture: applicationState.culture(),
                    category: applicationState.category(),
                    region: applicationState.region(),
                    competition: applicationState.competition()
                }).then(function(values) {
                    return contentService.getPageContent({
                        market: values.culture.urlMarketCode,
                        categoryId: values.category.id,
                        regionId: values.region.id,
                        competitionId: values.competition.id
                    }).then(function(data) {
                        return {
                            culture: values.culture,
                            category: values.category,
                            region: values.region,
                            competition: values.competition,
                            data: data
                        };
                    });
                });
            };

            self.getSeoContentForEventLobby = function() {
                return $q.all({
                    culture: applicationState.culture(),
                    category: applicationState.category(),
                    region: applicationState.region(),
                    competition: applicationState.competition(),
                    event: applicationState.event()
                }).then(function(values) {
                    return contentService.getPageContent({
                        market: values.culture.urlMarketCode,
                        categoryId: values.category.id,
                        regionId: values.region.id,
                        competitionId: values.competition.id,
                        eventId: values.event.id
                    }).then(function(data) {
                        return {
                            culture: values.culture,
                            category: values.category,
                            region: values.region,
                            competition: values.competition,
                            event: values.event,
                            data: data
                        };
                    });
                });
            };
        }
        ContentDataServiceClass.$inject = ["$q", "$stateParams", "applicationState", "contentService"];
        return ContentDataServiceClass;
    }());

    angular.module('sportsbook.content').service('contentDataService', ContentDataServiceClass);

}(window.angular));