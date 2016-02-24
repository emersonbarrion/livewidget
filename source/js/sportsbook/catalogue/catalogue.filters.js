(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.catalogue");

    var deriveEventTree = function (node) {
        return (!node.children) ? node : _.map(node.children, deriveEventTree);
    };

    module.filter("catalogueDateFilter", [
        "lodash", "moment",
        function (_, moment) {

            var checkEventStartDate = function (eventArray, hoursAmount) {
                return _.some(eventArray, function (event) {
                    var eventStartDate = moment(event.startDate);
                    var diff = (moment.duration(eventStartDate.diff(moment()))).asHours();
                    return (diff <= hoursAmount && diff > 0);
                });
            };

            return function (collection, hoursAmount) {
                return (!hoursAmount) ? collection : _.filter(collection, function (node) {
                    var events = _.flattenDeep(deriveEventTree(node));
                    return checkEventStartDate(events, hoursAmount);
                });
            };
        }
    ]);

    /**
     * @ngdoc filter
     * @name sportsbook.catalogue.filter:cataloguePhase
     * @requires angular-sitestack-modules.lodash
     * @requires sportsbook.catalogue.liveCatalogueService
     * @function
     *
     * @description
     * Filter a given catalogue item according to the given phase.
     *
     * @param {array} collection - The catalogue to filter.
     * @param {number} phase - The phase number to filter with (0 = all, 1 = prematch, 2 = live).
     * @returns {array} The filtered catalogue.
     */
    module.filter("cataloguePhase", [
        /*
         * Yes, we know that this is not an ideal way of filtering the catalogue by phase... 💩 💩 💩
         */
        "lodash", "liveCatalogueService",
        function (_, liveCatalogueService) {

            var isLiveEvent = function (e) {
                return !!liveCatalogueService.liveEventIdsSet[e.id];
            };

            var isPrematchEvent = function (e) {
                return !liveCatalogueService.liveEventIdsSet[e.id];
            };

            return function (collection, phase) {

                if (_.isUndefined(phase) || phase <= 0 || phase > 2) {
                    return collection;
                }

                var predicate = (phase === 1) ? isPrematchEvent : isLiveEvent;

                return _.filter(collection, function (node) {
                    var events = _.flattenDeep(deriveEventTree(node));
                    return _.any(events, predicate);
                });
            };
        }
    ]);

})(window.angular);