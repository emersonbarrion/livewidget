(function (angular) {
    "use strict";

    // View model definition.
    var baseCouponViewModel = function (couponType, maximumNumberOfSelections, initialData) {

        /* jshint validthis: true */
        var self = this;

        // Internal states
        self._totalStake = 0.0;
        self._totalEffectiveStake = 0.0;
        self._totalPotentialWin = 0.0;
        self._totalOdds = 0.0;
        self._taxRate = 0.0;

        Object.defineProperties(self, {
            "type": {
                "value": couponType,
                "enumerable": true
            },
            "maximumNumberOfSelections": {
                "value": maximumNumberOfSelections,
                "enumerable": true
            },
            "selections": {
                "value": {},
                "enumerable": true
            },
            "bets": {
                "value": {},
                "enumerable": true
            },
            "totalStake": {
                "get": function () {
                    return self._totalStake;
                },
                "enumerable": true
            },
            "totalEffectiveStake": {
                "get": function () {
                    return self._totalEffectiveStake;
                },
                "enumerable": true
            },
            "totalOdds": {
                "get": function () {
                    return self._totalOdds;
                },
                "enumerable": true
            },
            "totalPotentialWin": {
                "get": function () {
                    return self._totalPotentialWin;
                },
                "enumerable": true
            },
            "taxRate": {
                "get": function () {
                    return self._taxRate;
                },
                "set": function (value) {
                    self._taxRate = value ? value : 0.0;
                    self.update();
                },
                "enumerable": true
            },
            "containsLiveSelection": {
                "get": function () {
                    return _.any(this.selections, {
                        isLive: true
                    });
                },
                "enumerable": true
            },
            "numberOfSelections": {
                "get": function () {
                    return _.values(self.selections).length;
                },
                "enumerable": true
            },
            "isLimitReached": {
                "get": function () {
                    return (this.maximumNumberOfSelections !== 0 && this.numberOfSelections >= this.maximumNumberOfSelections);
                },
                "enumerable": true
            }
        });

        self.updateSelections(initialData);
    };

    baseCouponViewModel.prototype.toSelection = function (selection) {
        return {
            id: selection.id,
            name: selection.name,
            eventName: selection.eventName,
            marketName: selection.marketName,
            opponentName: this.getOpponentName(selection),
            odds: selection.odds,
            isLive: selection.isLive,
            betslipOrder: selection.betslipOrder,
            originalSelection: selection
        };
    };

    baseCouponViewModel.prototype.getOpponentName = function (selection) {
        var market = selection.getParent();

        if (!market || !market.isHeadToHead) {
            return null;
        }

        var firstSibling = _.first(selection.getSiblings());

        return (firstSibling) ? firstSibling.name : null;
    };

    baseCouponViewModel.prototype.mergeSelections = function (target, source) {

        target.name = source.name;
        target.eventName = source.eventName;
        target.marketName = source.marketName;
        target.opponentName = this.getOpponentName(source);

        target.oldOdds = target.odds;
        target.odds = source.odds;
    };

    baseCouponViewModel.prototype.update = function () {
        this._totalStake = this._getTotalStake();
        this._totalEffectiveStake = this._getTotalEffectiveStake();
        this._totalOdds = this._getTotalOdds();
        this._totalPotentialWin = this._getTotalPotentialWin();
    };

    baseCouponViewModel.prototype.getStakeUsedForBonus = function () {
        throw new Error("Not implemented");
    };

    baseCouponViewModel.prototype.setStakeUsedForBonus = function () {
        throw new Error("Not implemented");
    };

    baseCouponViewModel.prototype._mergeSelections = function (selectionsByMarketId) {
        var self = this;
        var selectionsDeletedOrAdded = false;

        _.forEach(self.selections, function (selection) {
            if (!selectionsByMarketId[selection.originalSelection.marketId]) {
                selectionsDeletedOrAdded = true;
                delete self.selections[selection.id];
            }
        });

        _.forEach(selectionsByMarketId, function (selection) {
            var selectionId = selection.id;

            if (!self.selections[selectionId]) {
                selectionsDeletedOrAdded = true;
                self.selections[selectionId] = self.toSelection(selection);
            } else {
                self.mergeSelections(self.selections[selectionId], selection);
            }
        });

        return selectionsDeletedOrAdded;
    };

    baseCouponViewModel.prototype.updateSelections = function (selectionsByMarketId) {

        var selectionAddedOrRemoved = this._mergeSelections(selectionsByMarketId);

        if (selectionAddedOrRemoved) {
            this._updateBets();
        }

        this.update();
    };

    baseCouponViewModel.prototype.request = function () {
        return {
            "bonusCustomerId": null,
            "bets": this._getBetsRequest()
        };
    };

    // The following functions are to be supplied by descendant classes.

    /* istanbul ignore next */
    baseCouponViewModel.prototype._updateBets = function () {
        throw new Error("Not implemented");
    };

    /* istanbul ignore next */
    baseCouponViewModel.prototype._getBetsRequest = function () {
        throw new Error("Not implemented");
    };

    /* istanbul ignore next */
    baseCouponViewModel.prototype._getTotalStake = function () {
        throw new Error("Not implemented");
    };

    /* istanbul ignore next */
    baseCouponViewModel.prototype._getTotalEffectiveStake = function () {
        throw new Error("Not implemented");
    };

    /* istanbul ignore next */
    baseCouponViewModel.prototype._getTotalOdds = function () {
        throw new Error("Not implemented");
    };

    /* istanbul ignore next */
    baseCouponViewModel.prototype._getTotalPotentialWin = function () {
        throw new Error("Not implemented");
    };

    baseCouponViewModel.prototype.markForManualAttest = function (stake, valueToAttest) {
        this.isForManualAttest = true;
        this.stake = stake;
        this.stakeForReview = valueToAttest;
    };

    // Factory definition.
    var baseCouponViewModelFactory = function () {
        return baseCouponViewModel;
    };

    angular
        .module("sportsbook.bets")
        .factory("baseCouponViewModelFactory", [baseCouponViewModelFactory]);

}(window.angular));