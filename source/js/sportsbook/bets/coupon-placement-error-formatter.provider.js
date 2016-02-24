(function(angular) {
    "use strict";

    var module = angular.module('sportsbook.bets');

    /**
     * @ngdoc service
     * @name sportsbook.bets:couponPlacementErrorFormatter
     * @description Provider for the Betting services
     */
    module.provider('couponPlacementErrorFormatter', function () {
        var self = this;

        self.errorConfigurationByCode = {};

        self.$get = ['couponPlacementErrorFormatterService', function (couponPlacementErrorFormatterService) {
            return {
                format: function (errors, errorParameters) {
                    return couponPlacementErrorFormatterService.format(errors, self.errorConfigurationByCode, errorParameters);
                }
            };
        }];
    });

}(window.angular));
