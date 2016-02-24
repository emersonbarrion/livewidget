(function (angular) {
    "use strict";

    var DECIMAL_ROUNDING_PRECISION = 2;

    var module = angular.module('sportsbook.betHistory');

    // declare the default BetsService class
    var BetHistoryServiceClass = function ($http, apiConfig, couponTypes, betStatus) {
        // store the injected dependencies
        var self = this;
        self.$http = $http;
        self.apiConfig = apiConfig;
        self.couponTypes = couponTypes;
        self.betStatus = betStatus;
    };

    /**
     * @ngdoc method
     * @name sportsbook.betHistory.betHistoryService#getHistory
     * @methodOf sportsbook.betHistory.betHistoryService
     * @description Requests the current user's bet history.
     */
    BetHistoryServiceClass.prototype.getHistory = function (options) {
        var self = this;
        return self.apiConfig.directUrlFor({
            path: "/bethistory"
        }).then(function (url) {
            return self.$http({
                method: 'GET',
                params: options,
                url: url
            }).then(function (response) {
                return response.data;
            });
        });
    };

    BetHistoryServiceClass.prototype.roundNumber = function (num) {
        return _.round(num, DECIMAL_ROUNDING_PRECISION);
    };

    BetHistoryServiceClass.prototype.getPotentialWin = function (coupon) {
        var self = this;
        return _.chain(coupon.bets)
            .map(function (bet) {
                return self.getBetPotentialWin(bet);
            })
            .sum()
            .round(DECIMAL_ROUNDING_PRECISION)
            .value();
    };

    BetHistoryServiceClass.prototype.getBetPotentialWin = function (bet) {
        return this.roundNumber(this.getBetTotalOdds(bet) * this.roundNumber(bet.stake));
    };

    BetHistoryServiceClass.prototype.getBetTotalOdds = function (bet) {
        return _.chain(bet.betSelections)
            .pluck("odds")
            .reduce(function (total, n) {
                return total * n;
            }, 1)
            .round(DECIMAL_ROUNDING_PRECISION)
            .value();
    };

    BetHistoryServiceClass.prototype.getTotalWinnings = function (coupon) {
        var self = this;
        return _.chain(coupon.bets)
            .map(function (bet) {
                return self.getBetTotalWinnings(bet);
            })
            .sum()
            .value();
    };

    BetHistoryServiceClass.prototype.getBetTotalWinnings = function (bet) {
        var totalWonBets = (bet.status !== this.betStatus.WON) ? 0 : (bet.stake * this.getBetTotalOdds(bet));
        return this.roundNumber(totalWonBets);
    };

    BetHistoryServiceClass.prototype.getCouponType = function (coupon) {
        var bets = coupon.bets;
        var betsLength = bets.length;
        var self = this;

        if (betsLength === 1 && bets[0].betSelections.length > 1) {
            return self.couponTypes.combi;
        } else {
            var singleBetSelections = _.filter(bets, function (bet) {
                return bet.betSelections.length === 1;
            });

            if (singleBetSelections.length === bets.length) {
                return self.couponTypes.single;
            }
        }

        return self.couponTypes.system;
    };


    BetHistoryServiceClass.prototype.getBetStatus = function (coupon, translationKeysByBetStatus) {
        var self = this;

        if (self.getCouponType(coupon) !== self.couponTypes.system) {
            return translationKeysByBetStatus[_.first(coupon.bets).status];
        } else {
            if (_.find(coupon.bets, function (bet) {
                    return bet.status === self.betStatus.OPEN;
                })) {
                return 'Open';
            } else {
                if (_.find(coupon.bets, function (bet) {
                        return bet.status === self.betStatus.WON;
                    })) {
                    return "Won";
                }
            }

            if (_.find(coupon.bets, function (bet) {
                    return bet.status === self.betStatus.VOID;
                })) {
                var voidStatus = _.reduce(coupon.bets, function (previousBet, currentBet) {
                    return (previousBet === currentBet) ? currentBet : true;
                });
                if (voidStatus) {
                    return "Void";
                }
            }
            return "Lost";
        }
    };

    /**
     * @ngdoc method
     * @name sportsbook.betHistory.betHistoryService#getBetDetails
     * @methodOf sportsbook.betHistory.betHistoryService
     * @description Requests the details for the bet identified by the given id.
     */
    BetHistoryServiceClass.prototype.getBetDetails = function (options) {
        var self = this;
        return self.apiConfig.directUrlFor({
            path: '/bethistorydetails'
        }).then(function (url) {
            return self.$http({
                method: 'GET',
                params: options,
                url: url
            }).then(function (response) {
                return response.data;
            });
        });
    };

    /**
     * @ngdoc service
     * @name sportsbook.betHistory.betHistoryService
     * @description bets history factory to be consumed by the betHistoryProvider
     */
    module.service('betHistoryService', ['$http', 'apiConfig', 'couponTypes', 'betStatus', BetHistoryServiceClass]);

}(window.angular));
