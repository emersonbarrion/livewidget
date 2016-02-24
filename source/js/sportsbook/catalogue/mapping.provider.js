(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.configuration');

    /**
     * @ngdoc service
     * @name sportsbook.configuration.catalogueMappingsProvider
     * @description Provider for the Catalogue services
     */
    module.provider('catalogueMappings', function () {

        /**
         * @ngdoc method
         * @name sportsbook.configuration.catalogueMappingsProvider#$get
         * @methodOf sportsbook.configuration.catalogueMappingsProvider
         * @description Default $get method for the catalogueProvider
         * @requires sportsbook.configuration.catalogueMappingService
         */
        this.$get = ['catalogueMappingService', function (service) {
            return {
                byId: function (id) {
                    return service.byId(id);
                }
            };
        }];
    });

}(window.angular));
