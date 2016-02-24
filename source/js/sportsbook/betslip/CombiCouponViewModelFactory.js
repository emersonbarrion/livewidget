
(function (angular) {
    "use strict";

    var combiCouponViewModelFactory = function (couponTypes, baseCouponViewModelFactory, sportsbookConfiguration, _) {

        var combiCouponViewModel = defineDescendant(baseCouponViewModelFactory, function () {

            Object.defineProperties(this, {
                "stake": {
                    "value": 0,
                    "writable": true,
                    "enumerable": true
                },
                "stakeForReview": {
                    "value": 0,
                    "writable": true,
                    "enumerable": true
                },
                "isForManualAttest": {
                    "value": false,
                    "writable": true,
                    "enumerable": true
                }
            });
        }, [couponTypes.combi, sportsbookConfiguration.maximumCombinationSelections]);

        combiCouponViewModel.prototype._updateBets = function () {};

        combiCouponViewModel.prototype._getBetsRequest = function () {
            var self = this;

            return [{
                stake: self.stake,
                stakeForReview: self.stakeForReview,
                betSelections: _.map(self.selections, function (selection) {
                    return {
                        marketSelectionId: selection.id,
                        odds: selection.odds
                    };
                })
            }];
        };

        combiCouponViewModel.prototype._getTotalStake = function () {
            var self = this;
            return self.stake;
        };

        combiCouponViewModel.prototype._getTotalEffectiveStake = function () {
            var self = this;
            var tax = (self.stake * self.taxRate).roundAtMidpoint(2);
            return self.stake - tax; // Deduct the tax from the stake
        };

        combiCouponViewModel.prototype._getTotalOdds = function () {
            var self = this;

            if (_.isEmpty(self.selections)) {
                return 0; // no odds on coupon - AD
            }

            return _.chain(self.selections)
                .pluck("odds")
                .reduce(function (total, n) {
                    return total * n;
                }, 1)
                .round(2)
                .value();
        };

        combiCouponViewModel.prototype.getStakeUsedForBonus = function () {
            return this.stake;
        };

        combiCouponViewModel.prototype.setStakeUsedForBonus = function (stake) {
            this.stake = stake;
        };

        combiCouponViewModel.prototype._getTotalPotentialWin = function () {
            var self = this;
            var totalOdds = self._getTotalOdds();
            var tax = (self.stake * self.taxRate).roundAtMidpoint(2);
            return _.round(totalOdds * (self.stake - tax), 2);
        };

        return combiCouponViewModel;
    };

    angular
        .module("sportsbook.betslip")
        .factory("combiCouponViewModelFactory", ["couponTypes", "baseCouponViewModelFactory", "sportsbookConfiguration", "lodash", combiCouponViewModelFactory]);

}(window.angular));