(function (angular) {
    "use strict";

    var EventDataServiceClass = (function () {

        var dependencies = {};

        function EventDataServiceClass($q, applicationState, widgetConfigurations, eventsResource, lodash) {
            dependencies.$q = $q;
            dependencies.applicationState = applicationState;
            dependencies.widgetConfigurations = widgetConfigurations;
            dependencies.eventsResource = eventsResource;
            dependencies.lodash = lodash;

        }

        EventDataServiceClass.$inject = ['$q', 'applicationState', 'widgetConfigurations', 'eventsResource', 'lodash'];

        EventDataServiceClass.prototype.getEventFromUrlName = function (urlEventName) {
            var $q = dependencies.$q;

            var applicationState = dependencies.applicationState;

            return $q.all({
                culture: applicationState.culture(),
                category: applicationState.category(),
                region: applicationState.region(),
                competition: applicationState.competition()
            }).then(function (params) {
                return dependencies.eventsResource.query({
                    categoryIds: params.category.id,
                    regionIds: params.region.id,
                    subCategoryIds: params.competition.id,
                    exclude: "markets"
                }, params.culture, true);
            }).then(function (events) {
                var result = dependencies.lodash.find(events, function (event) {
                    return event.shortName && event.shortName.endsWith(urlEventName);
                });

                if (!result) {
                    return $q.reject({
                        "id": 0,
                        "errorCode": 404
                    });
                }

                return result;
            });
        };

        return EventDataServiceClass;
    }());

    angular.module('sportsbook.markets').service('eventDataService', EventDataServiceClass);
}(angular));
