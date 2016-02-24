(function (angular) {
    "use strict";

    angular.module('angular-sitestack-culture')

        /**
        * @ngdoc service
        * @name angular-sitestack-culture.cultureProvider
        * @description Provider for the Culture services
        */
        .provider("cultureProvider", [function () {
            /**
             * @ngdoc method
             * @name angular-sitestack-culture.cultureProvider#cultureService
             * @methodOf angular-sitestack-culture.cultureProvider
             * @description Default $get method for the cultureProvider
             * @requires angular-sitestack-culture#cultureService, tmh.dynamicLocale#tmhDynamicLocale
             */
            this.$get = ['tmhDynamicLocale', 'cultureService', '$log', function (tmhDynamicLocale, cultureService, $log) {
                return {
                    /**
                     * @ngdoc method
                     * @name angular-sitestack-culture.cultureProvider#setLocale
                     * @methodOf angular-sitestack-culture.cultureProvider
                     * @param {string} urlMarketCode - The string representation of the market code in the url
                     * @description Returns the category prematch items
                     */
                    setLocale: function (urlMarketCode) {
                        return cultureService.getCulture(urlMarketCode).then(function (data) {

                            var cultureName = (data) ? data.cultureInfo : 'en-GB';
                            cultureName = (cultureName) ? cultureName : 'en-GB';

                            return tmhDynamicLocale.set(cultureName).then(function () {
                                return data;
                            }, function (response) {
                                // On Failed Dynamic Locale loading, default to en-GB
                                $log.warn('Failed to load locale ' + cultureName + '. Default to en-GB.', response);
                                return tmhDynamicLocale.set('en-GB').then(function () {
                                    return data;
                                });
                            });
                        });
                    }
                };
            }];
        }]);

}(angular));
