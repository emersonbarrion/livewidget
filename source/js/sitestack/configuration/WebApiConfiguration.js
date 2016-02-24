(function (angular) {
    "use strict";

    var sitestackService = angular.module('angular-sitestack-application');

    /**
     * @ngdoc service
     * @name angular-sitestack-application.siteStackConfiguration
     */
    sitestackService.provider('siteStackConfiguration', function () {
        this.config = {
            'sskBusy': '/templates/sitestack/utilities/ssk-busy.html',
            'promotions': "/promotions/",
            'translateRestLoader': '/i10n',
            'services': {
                'proxyUrl': "",
            },
            'routingConfiguration': '/templates/config/routing/'
        };

        this.$get = function () {
            return this.config;
        };
    });

    /**
     * @ngdoc service
     * @name angular-sitestack-application.sitestackApiConfig
     * @description Provides common information related to the web api, such as name-id mappings, version and url.
     * @requires angular-sitestack-application.applicationState
     * @requires $q
     * @requires angular-sitestack-application.siteStackConfiguration
     */
    sitestackService.service('sitestackApiConfig', ['applicationState', '$q', 'siteStackConfiguration',
        function (applicationState, $q, siteStackConfiguration) {
            var self = this;

            /**
             * @ngdoc property
             * @name angular-sitestack-application.sitestackApiConfig#version
             * @propertyOf angular-sitestack-application.sitestackApiConfig
             * @description Specifies the version of the web api which the application will communicate with.
             * @returns {number} The version number for the web api.
             */
            self.version = 1;

            /**
             * @ngdoc property
             * @name angular-sitestack-application.sitestackApiConfig#url
             * @propertyOf angular-sitestack-application.sitestackApiConfig
             * @description Specifies the url of the web api which the application will communicate with. The url is set at build time using the api-url substitution in grunt.
             * @returns {string} The url for the web api.
             */
            self.url = siteStackConfiguration.services.proxyUrl; // "http://api.sitestack.betsson.sitestack.mylocal";


            /**
             * @ngdoc method
             * @name angular-sitestack-application.sitestackApiConfig#urlFor
             * @methodOf angular-sitestack-application.sitestackApiConfig
             * @description Returns a promise for a path, which is based on the api URL, the active language and the api version.
             * @param {object} options - Options describing the requested url.
             * @param {string} options.path - The relative path for the url.
             * @param {string} options.urlMarketCode - The market code, which is the top level path for the url.
             * @returns {Promise} A promise which resolves to the absolute url for the given path.
             */
            self.urlFor = function (options) {
                if (!options.urlMarketCode) {
                    return applicationState.culture().then(function (culture) {
                        return self._buildUrl(options.path, culture.urlMarketCode);
                    });
                } else {
                    return $q.when(self._buildUrl(options.path, options.urlMarketCode));
                }

            };

            self._buildUrl = function (path, language) {
                return self.url + "/" + language + "/" + self.version + path;
            };
        }
    ]);

})(angular);
