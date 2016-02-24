(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.validations');

    /**
     * @ngdoc service
     * @name sportsbook.validations:couponValidationProvider
     * @description Provider for selection rule validation
     */
    module.provider('couponValidation', function () {
        var provider = this;

        provider.messageKeyByRuleId = {
            "default": "default"
        };

        /**
         * @ngdoc method
         * @name sportsbook.validations:couponValidationProvider#couponValidationService
         * @methodOf sportsbook.validations:couponValidationProvider
         * @description Default $get method for the couponValidationProvider
         * @requires sportsbook.validation:couponValidationService
         */
        provider.$get = ['couponValidationService', function (couponValidationService) {
            return {
                /**
                 * @ngdoc method
                 * @name sportsbook.validations:couponValidationService#validate
                 * @methodOf sportsbook.validations:couponValidationService
                 * @param {object} context - The context to validate
                 * @description Runs rule validations on the given context.
                 */
                validate: function (context) {
                    return couponValidationService.validate(context, provider.messageKeyByRuleId);
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.validations:couponValidationService#testSelection
                 * @methodOf sportsbook.validations:couponValidationService
                 * @param {selection} selection - The selection to test.
                 * @param {object} context - The context to test against.
                 * @description Runs validation rules on the given selection against the givent context.
                 */
                testSelection: function (selection, context) {
                    return couponValidationService.testSelection(selection, context, provider.messageKeyByRuleId);
                }
            };
        }];
    });

}(window.angular));
