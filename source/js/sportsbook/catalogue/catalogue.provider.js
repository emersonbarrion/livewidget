(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.catalogue');

    /**
     * @ngdoc service
     * @name sportsbook.catalogue.catalogue
     * @description Provider for the Catalogue services
     */
    module.provider('catalogue', function () {

        /**
         * @ngdoc method
         * @name sportsbook.catalogue.catalogue#$get
         * @methodOf sportsbook.catalogue.catalogue
         * @description Default $get method for the catalogue
         * @requires sportsbook.catalogue.catalogueService
         */
        this.$get = ['catalogueService', function (catalogueService) {
            return {

                /**
                 * @ngdoc method
                 * @name sportsbook.catalogue.catalogue#getCategory
                 * @methodOf sportsbook.catalogue.catalogue
                 * @param {object} options - The request parameters.
                 * @param {number} options.id - The id of the item to retrieve. If this is present, it will be used in preference to the category name.
                 * @param {string} options.category - The string representation of the category to retrieve
                 * @param {number=} options.phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
                 * @description Returns the category prematch items
                 */
                getCategory: function (options) {
                    return catalogueService.getCategory(options);
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.catalogue.catalogue#getRegion
                 * @methodOf sportsbook.catalogue.catalogue
                 * @param {object} options - The request parameters.
                 * @param {number} options.id - The id of the item to retrieve. If this is present, it will be used in preference to the category and region names.
                 * @param {string} options.category - The string representation of the category to retrieve
                 * @param {string} options.region - The string representation of the region to retrieve
                 * @param {number=} options.phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
                 * @description Returns the category prematch items
                 */
                getRegion: function (options) {
                    return catalogueService.getRegion(options);
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.catalogue.catalogue#getCompetition
                 * @methodOf sportsbook.catalogue.catalogue
                 * @param {object} options - The request parameters.
                 * @param {number} options.id - The id of the item to retrieve. If this is present, it will be used in preference to the category, region and competition names.
                 * @param {string} options.category - The string representation of the category to retrieve
                 * @param {string} options.region - The string representation of the region to retrieve
                 * @param {string} options.competition - The string representation of the competition to retrieve
                 * @param {number=} options.phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
                 * @description Returns the category prematch items
                 */
                getCompetition: function (options) {
                    return catalogueService.getCompetition(options);
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.catalogue.catalogue#getMenu
                 * @methodOf sportsbook.catalogue.catalogue
                 * @param {number=} phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
                 * @description Returns the navigation menu prematch items
                 */
                getMenu: function (menuType) {
                    return catalogueService.getMenu(menuType);
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.catalogue.catalogue#getCategories
                 * @methodOf sportsbook.catalogue.catalogue
                 * @param {number=} phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
                 * @description Returns the navigation menu prematch items
                 */
                getCategories: function (menuType) {
                    return catalogueService.getCategories(menuType);
                },


                /**
                 * @ngdoc method
                 * @name sportsbook.catalogue.catalogue#getEventMap
                 * @methodOf sportsbook.catalogue.catalogue
                 * @description
                 * Returns an object mapping events to categories, regions and competitions.
                 *
                 * @param {object=} options - Optional parameters
                 * @param {number=} options.phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
                 */
                getEventMap: function (eventMapType) {
                    return catalogueService.getEventMap(eventMapType);
                }
            };
        }];
    });

}(window.angular));
