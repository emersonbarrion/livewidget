(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.bets");

    /**
     * @ngdoc service
     * @name sportsbook.bets:betsProvider
     * @description Provider for the Betting services
     */
    module.provider('bets', function () {
        var self = this;

        self.getStatusNumberOfRetries = 0;
        self.getStatusTimeoutPerRetry = 0;

        /**
         * @ngdoc method
         * @name sportsbook.bets:betsProvider#betsService
         * @methodOf sportsbook.bets:betsProvider
         * @description Default $get method for the betsProvider
         * @requires sportsbook.bets:betsService
         */
        self.$get = ['betsService', function (betsService) {
            return {
                isSubmittingCoupon: function () {
                    return betsService.isSubmittingCoupon();
                },
                submitCoupon: function (options) {
                    return betsService.submitCoupon(self.getStatusNumberOfRetries, self.getStatusTimeoutPerRetry, options);
                }
            };
        }];
    });

}(window.angular));