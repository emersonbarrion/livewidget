(function (angular) {
    "use strict";

    angular.module('sportsbook.catalogue')
        .provider('liveCatalogue', function () {
            var configuration = {
                liveIntervalMillis: 60000,
                defaultIntervalMillis: 60000
            };

            return {
                setDefaultIntervalMillis: function (defaultIntervalMillis) {
                    configuration.defaultIntervalMillis = defaultIntervalMillis;
                },

                setLiveIntervalMillis: function (liveIntervalMillis) {
                    configuration.liveIntervalMillis = liveIntervalMillis;
                },

                $get: ['liveCatalogueService', function (liveCatalogueService) {
                    liveCatalogueService.init({
                        liveInterval: configuration.liveIntervalMillis,
                        defaultInterval: configuration.defaultIntervalMillis
                    });

                    return liveCatalogueService;
                }]
            };
        });
})(window.angular);