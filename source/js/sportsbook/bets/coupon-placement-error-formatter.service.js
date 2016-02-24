(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.betslip");

    // declare the default CouponPlacementErrorFormatter class
    var CouponPlacementErrorFormatterClass = function () {
        // constructor
    };

    CouponPlacementErrorFormatterClass.prototype.format = function (serverErrors, errorConfigurationByCode, errorTranslationParameters) {
        var self = this;

        var errorMessages = [];

        _.forEach(serverErrors, function (error) {
            var formattedError = {
                "code": error.code,
                "key": null,
                "params": _.merge({}, error.params),
                "options": null
            };

            _.assign(formattedError.params, errorTranslationParameters);

            var brandErrorConfigForCode = errorConfigurationByCode[error.code];
            if (!_.isEmpty(brandErrorConfigForCode)) {
                formattedError.key = brandErrorConfigForCode.key || null;
                formattedError.options = brandErrorConfigForCode.options || null;
            }

            if (_.isEmpty(error.selectionParameters)) {
                errorMessages.push(_.cloneDeep(formattedError));
                return;
            }

            _.forEach(error.selectionParameters, function (selectionParameter) {
                var clonedError = _.cloneDeep(formattedError);
                var selection = selectionParameter.selection;

                var selectionId = selection.id;
                var selectionName = selection.name;
                var marketName = selection.marketName;
                var eventName = selection.eventName;

                var parameters = {
                    selectionId: selectionId,
                    selectionName: selectionName,
                    marketName: marketName,
                    eventName: eventName
                };

                _.assign(clonedError.params, parameters);
                errorMessages.push(clonedError);
            });
        });

        return errorMessages;
    };

    module.service('couponPlacementErrorFormatterService', CouponPlacementErrorFormatterClass);

}(window.angular));