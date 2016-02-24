(function (angular) {
    "use strict";

    var singleCouponViewModelFactory = function (couponTypes, baseCouponViewModelFactory, sportsbookConfiguration, _) {

        var singleCouponViewModel = defineDescendant(baseCouponViewModelFactory, function () {}, [couponTypes.single, sportsbookConfiguration.maximumSingleSelections]);

        singleCouponViewModel.prototype._updateBets = function () {
            var self = this;

            _.forEach(self.bets, function (bet, betSelectionId) {
                if (!self.selections[betSelectionId]) {
                    delete self.bets[betSelectionId];
                }
            });

            _.forEach(self.selections, function (selection, selectionId) {
                if (!self.bets[selectionId]) {
                    self.bets[selectionId] = {
                        "selectionId": selectionId,
                        "stake": 0,
                        "stakeForReview": 0,
                        "isForManualAttest": false
                    };
                }
            });
        };

        singleCouponViewModel.prototype._getBetsRequest = function () {
            var self = this;

            return _.map(self.bets, function (bet) {
                return {
                    stake: bet.stake,
                    stakeForReview: bet.stakeForReview,
                    betSelections: [{
                        marketSelectionId: bet.selectionId,
                        odds: self.selections[bet.selectionId].odds
                    }]
                };
            });
        };

        singleCouponViewModel.prototype._getTotalStake = function () {
            return _.chain(this.bets).map("stake").sum().value();
        };

        singleCouponViewModel.prototype._getTotalEffectiveStake = function () {
            var self = this;

            return _.chain(self.bets)
                .map(function (bet) {
                    var tax = (bet.stake * self.taxRate).roundAtMidpoint(2);
                    return bet.stake - tax; // Deduct the tax from each stake
                })
                .sum()
                .value();
        };

        singleCouponViewModel.prototype._getTotalOdds = function () {
            var self = this;

            return _.chain(self.selections)
                .map("odds")
                .sum()
                .value();
        };

        singleCouponViewModel.prototype._getTotalPotentialWin = function () {
            var self = this;

            return _.chain(self.selections)
                .map(function (selection) {
                    var bet = self.bets[selection.id];
                    var tax = (bet.stake * self.taxRate).roundAtMidpoint(2);
                    return selection.odds * (bet.stake - tax);
                })
                .sum()
                .round(2)
                .value();
        };

        singleCouponViewModel.prototype.getFirstBet = function () {
            return _.chain(this.bets).values().first().value();
        };

        singleCouponViewModel.prototype.markForManualAttest = function (stake, valueToAttest) {
            this.isForManualAttest = true;

            var firstBet = this.getFirstBet();

            if (firstBet) {
                firstBet.stake = stake;
                firstBet.stakeForReview = valueToAttest;
            }
        };

        singleCouponViewModel.prototype.getStakeUsedForBonus = function (stake) {
            if (_.keys(this.selections).length !== 1) {
                return null;
            }

            var firstBet = this.getFirstBet();
            return firstBet.stake;
        };

        singleCouponViewModel.prototype.setStakeUsedForBonus = function (stake) {
            if (_.keys(this.selections).length !== 1) {
                $log.error("Attempted to set stake on single coupon with more than one selection.");
                return;
            }

            var firstBet = this.getFirstBet();
            firstBet.stake = stake;
        };

        return singleCouponViewModel;
    };

    angular
        .module("sportsbook.betslip")
        .factory("singleCouponViewModelFactory", ["couponTypes", "baseCouponViewModelFactory", "sportsbookConfiguration", "lodash", singleCouponViewModelFactory]);

}(window.angular));