(function(angular) {
    "use strict";

    var module = angular.module("sportsbook.validations");

    // declare the default BetsService class
    var CouponValidationServiceClass = function(lodash, $log, couponTypes) {
        this.lodash = lodash;
        this.$log = $log;
        this.types = couponTypes;
    };

    /**
     * @ngdoc method
     * @name sportsbook.validations:couponValidationService#requireMultiSelectionValidation
     * @methodOf sportsbook.validations:couponValidationService
     * @param {object} context - The context to validate
     * @description Determines if the context requires validations based on selection combinations. These do not apply to single type coupons.
     */
    CouponValidationServiceClass.prototype.requireMultiSelectionValidation = function(context) {
        return context.couponType !== this.types.single;
    };

    /**
     * @ngdoc method
     * @name sportsbook.validations:couponValidationService#validate
     * @methodOf sportsbook.validations:couponValidationService
     * @param {object} context - The context to validate
     * @description Runs validation rules on the given context.
     */
    CouponValidationServiceClass.prototype.validate = function (context, messageKeyByRuleId) {
        return this.testCombination(_.values(context.selectionsByMarketId.content), this.requireMultiSelectionValidation(context), messageKeyByRuleId);
    };

    /**
     * @ngdoc method
     * @name sportsbook.validations:couponValidationService#testSelection
     * @methodOf sportsbook.validations:couponValidationService
     * @param {selection} selection - The selection to test.
     * @param {object} context - The context to test against.
     * @description Runs validation rules on the given selection against the givent context.
     */
    CouponValidationServiceClass.prototype.testSelection = function (selection, context, messageKeyByRuleId) {
        // Rules only apply to combinations of bets.
        if (!this.requireMultiSelectionValidation(context)) {
            return [];
        }

        var selectionsToTest = _.values(context.selectionsByMarketId.content);
        selectionsToTest.push(selection);

        return this.testCombination(selectionsToTest, true, messageKeyByRuleId);
    };

    /**
     * @ngdoc method
     * @name sportsbook.validations:couponValidationService#testCombination
     * @methodOf sportsbook.validations:couponValidationService
     * @param {Array} selections - The selection combination to test.
     * @description Ensures that all selections in the given set are valid when combined with the others.
     */
    CouponValidationServiceClass.prototype.testCombination = function (selections, testCombinationErrors, messageKeyByRuleId) {
        var self = this;
        var _ = self.lodash;
        var $log = self.$log;

        var validations = {};

        _.each(selections, function (selection) {
            var rulesToTest = [];

            if (testCombinationErrors) {
                var ruleId = selection.ruleId;

                var marketRule = Sportsbook.Rules.Repository[ruleId];

                if (!marketRule.assert) {
                    $log.warn("Rule error - the returned rule has no assert function (Rule id: " + ruleId + ")");
                    marketRule = Sportsbook.Rules.NoRestriction;
                }

                rulesToTest.push(marketRule);
            }

            rulesToTest.push.apply(rulesToTest, Sportsbook.Rules.ClientRepository);

            _.forEach(rulesToTest, function (rule) {
                var ruleMessageKey = messageKeyByRuleId[rule.id];

                if (!ruleMessageKey) {
                    ruleMessageKey = messageKeyByRuleId["default"];
                }

                var ruling = rule.assert(selections, selection, ruleMessageKey);

                if (!validations[ruleMessageKey]) {
                    validations[ruleMessageKey] = ruling;
                }

                // Aggregate any violations.
                var status = validations[ruleMessageKey];

                if (!ruling.passed) {
                    status.passed = false;
                }

                status.violations = _.union(status.violations, ruling.violations);
                status.affected = _.union(status.affected, ruling.affected);
            });
        });

        return _.compact(_.values(validations));
    };

    /**
     * @ngdoc service
     * @name sportsbook.validations:couponValidationService
     * @description The validation runner.
     */
    module.service("couponValidationService", ["lodash", "$log", "couponTypes", CouponValidationServiceClass]);

}(window.angular));
