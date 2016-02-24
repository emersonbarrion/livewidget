
(function (angular) {
    "use strict";

    var systemCouponViewModelFactory = function (couponTypes, baseCouponViewModelFactory, sportsbookConfiguration, _) {

        var systemCouponViewModel = defineDescendant(baseCouponViewModelFactory, function () {
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
        }, [couponTypes.system, sportsbookConfiguration.maximumSystemBetSelections]);

        systemCouponViewModel.prototype = Object.create(baseCouponViewModelFactory.prototype);

        systemCouponViewModel.prototype._generateCombinations = function (set, k) {
            var i, j, combs, head, tailcombs;

            /* istanbul ignore if */
            if (k > set.length || k <= 0) {
                return [];
            }

            if (k === set.length) {
                return [set];
            }

            if (k === 1) {
                combs = [];
                for (i = 0; i < set.length; i++) {
                    combs.push([set[i]]);
                }
                return combs;
            }

            combs = [];
            for (i = 0; i < set.length - k + 1; i++) {
                head = set.slice(i, i + 1);
                tailcombs = this._generateCombinations(set.slice(i + 1), k - 1);
                for (j = 0; j < tailcombs.length; j++) {
                    combs.push(head.concat(tailcombs[j]));
                }
            }
            return combs;
        };

        systemCouponViewModel.prototype._updateBets = function () {
            var self = this;
            var selectionIds = _.map(_.keys(self.selections), function (key) {
                return Number(key);
            });

            _.each(_.range(0, selectionIds.length), function (i) {
                var selectionsPerCombination = i + 1;

                if (!self.bets[i]) {
                    self.bets[i] = {
                        stake: 0,
                        stakeEnabled: true,
                        selectionsPerCombination: selectionsPerCombination,
                        combinations: null
                    };
                }

                self.bets[i].combinations = _.map(self._generateCombinations(selectionIds, selectionsPerCombination), function (listOfSelectionIds) {
                    return {
                        selectionIds: listOfSelectionIds
                    };
                });
            });

            _.each(_.range(selectionIds.length, _.keys(self.bets).length), function (i) {
                delete self.bets[i];
            });
        };

        systemCouponViewModel.prototype._getBetsRequest = function () {
            var self = this;

            return _.chain(self.bets)
                .filter(function (bet) {
                    return bet.stake > 0;
                }).map(function (bet) {
                    return _.map(bet.combinations, function (combination) {
                        return {
                            stake: bet.stake,
                            stakeForReview: 0,
                            betSelections: _.map(combination.selectionIds, function (selectionId) {
                                var selection = self.selections[selectionId];
                                return {
                                    marketSelectionId: selection.id,
                                    odds: selection.odds
                                };
                            })
                        };
                    });
                }).flatten()
                .value();
        };

        systemCouponViewModel.prototype.setStake = function (stake) {
            this.stake = stake;
        };

        systemCouponViewModel.prototype.update = function () {
            var self = this;

            var convertedGlobalStake = Number(self.stake);
            var globalStakeValid = !_.isNaN(convertedGlobalStake) && convertedGlobalStake !== 0;

            _.forEach(self.bets, function (bet) {
                if (globalStakeValid && bet.selectionsPerCombination > 1) {
                    bet.stake = self.stake;
                    bet.stakeEnabled = false;
                } else {
                    bet.stakeEnabled = true;
                }

                _.forEach(bet.combinations, function (combination) {
                    combination.totalOdds = _.chain(combination.selectionIds)
                        .reduce(function (oddsProduct, selectionId) {
                            return oddsProduct * self.selections[selectionId].odds;
                        }, 1)
                        .round(2)
                        .value();
                });
            });

            baseCouponViewModelFactory.prototype.update.call(self);
        };

        systemCouponViewModel.prototype.getStakeUsedForBonus = function (stake) {
            return null;
        };

        systemCouponViewModel.prototype.setStakeUsedForBonus = function (stake) {
            $log.error("Attempted to set bonus stake on system bet.");
        };

        systemCouponViewModel.prototype._getTotalStake = function () {
            var self = this;

            return _.sum(self.bets, function (bet) {
                return bet.stake * bet.combinations.length;
            });
        };

        systemCouponViewModel.prototype._getTotalEffectiveStake = function () {
            var self = this;

            return _.sum(self.bets, function (bet) {
                return _.sum(bet.combinations, function (combination) {
                    var tax = (bet.stake * self.taxRate).roundAtMidpoint(2);
                    return bet.stake - tax; // Deduct the tax from each bet stake
                });
            });
        };

        systemCouponViewModel.prototype._getTotalOdds = function () {
            var self = this;

            return _.round(_.sum(self.bets, function (bet) {
                return _.sum(bet.combinations, function (combination) {
                    return combination.totalOdds;
                });
            }), 2);
        };

        systemCouponViewModel.prototype._getTotalPotentialWin = function () {
            var self = this;

            return _.chain(self.bets)
                .sum(function (bet) {
                    return _.sum(bet.combinations, function (combination) {
                        var tax = (bet.stake * self.taxRate).roundAtMidpoint(2);
                        return (bet.stake - tax) * combination.totalOdds;
                    });
                })
                .round(2)
                .value();
        };

        return systemCouponViewModel;
    };

    angular
        .module("sportsbook.betslip")
        .factory("systemCouponViewModelFactory", ["couponTypes", "baseCouponViewModelFactory", "sportsbookConfiguration", "lodash", systemCouponViewModelFactory]);

}(window.angular));