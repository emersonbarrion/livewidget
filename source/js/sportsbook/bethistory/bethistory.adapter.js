(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.betHistory');

    function BetHistoryAdapterClass(lodash, betHistoryService) {
        var self = this;

        self.betHistoryService = betHistoryService;
        self.lodash = lodash;

    }

    // no function calls
    BetHistoryAdapterClass.prototype.toBetHistory = function (data, translationKeysByBetStatus) {
        var self = this;

        return {
            betHistoryItems: self.lodash.map(data.betHistoryItems, function (betHistoryItem) {
                return {
                    couponId: betHistoryItem.couponId,
                    couponArriveDate: new Date(betHistoryItem.couponArriveDate),
                    stake: betHistoryItem.stake,
                    taxAmount: betHistoryItem.taxAmount,
                    betStatus: betHistoryItem.betStatus,
                    statusText: translationKeysByBetStatus[betHistoryItem.betStatus],
                    isLive: betHistoryItem.isLive,
                    isMobile: betHistoryItem.isMobile,
                    isBonus: betHistoryItem.isBonus
                };
            }),
            numberOfPages: data.numberOfPages,
            numberOfCoupons: data.numberOfCoupons
        };
    };

    // no function calls
    BetHistoryAdapterClass.prototype._formatMarket = function (data, categoryInfo) {
        var self = this;

        if (!categoryInfo) {
            categoryInfo = {
                "categoryId": 0,
                "categoryName": "---",
                "regionName": "---",
                "subCategoryID": 0,
                "subCategoryName": "---"
            };
        }

        return {
            id: data.marketID,
            deadline: new Date(data.deadline),
            marketStatus: data.marketStatus,
            betGroup: {
                id: data.betGroup.betGroupID,
                typeID: data.betGroup.betGroupTypeID,
                groupings: data.betGroup.betGroupGroupings,
                classificationId: data.betGroup.betGroupTypeClassificationID,
                name: data.betGroup.betGroupName,
                displayName: data.betGroup.betGroupDisplayName,
                unitName: data.betGroup.unitName
            },
            event: {
                id: data.eventID,
                name: data.eventName,
                displayName: data.eventDisplayName

            },
            category: {
                id: categoryInfo.categoryId,
                name: categoryInfo.categoryName
            },
            region: {
                name: categoryInfo.regionName
            },
            subCategory: {
                id: categoryInfo.subCategoryID,
                name: categoryInfo.subCategoryName
            },
            displayName: data.eventDisplayName,
            helpText: data.eventDisplayName,
            count: data.marketCount,
            resultString: data.resultString,
            presentationType: data.marketPresentationType,
            participants: data.participants,
            hcpDisplayString: data.hcpDisplayString,
            startingPitcherDisplayString: data.startingPitcherDisplayString,
            betgroupBetSlipDisplayString: data.betgroupBetSlipDisplayString,
            groupingName: data.groupingName,
            isLive: data.isLive,
            isTv: data.isTv
        };
    };


    BetHistoryAdapterClass.prototype.toBetHistoryDetails = function (data, translationKeysByBetStatus) {
        var self = this;
        self.lodash = _;
        var marketsByMarketId = {};
        var categoryInfoById = {};
        var betsDeadlines = [];

        _.forEach(data.market, function (market) {
            betsDeadlines.push(new Date(market.deadline));
        });


        return {
            coupon: {
                bets: _.map(data.coupon.bets, function (bet) {
                    return {
                        stake: bet.stake,
                        stakeForReview: bet.stakeForReview,
                        taxAmount: bet.taxAmount,
                        totalOdds: self.betHistoryService.getBetTotalOdds(bet),
                        potentialWinnings: self.betHistoryService.getBetPotentialWin(bet),
                        totalWon: self.betHistoryService.getBetTotalWinnings(bet),
                        statusText: translationKeysByBetStatus[bet.status],
                        latestDeadline: _.max(betsDeadlines),
                        selections: _.map(bet.betSelections, function (betSelection) {
                            var processedMarket = marketsByMarketId[betSelection.marketId];

                            if (!processedMarket) {
                                var old = _.find(data.market, {
                                    marketID: betSelection.marketId
                                });
                                var categoryInfoKey = [old.categoryID, old.subCategoryID];

                                var categoryInfo = categoryInfoById[categoryInfoKey];

                                if (!categoryInfo) {
                                    categoryInfo = _.find(data.subCategory, {
                                        subCategoryID: old.subCategoryID,
                                        categoryId: old.categoryID
                                    });
                                    categoryInfoById[categoryInfoKey] = categoryInfo;
                                }

                                processedMarket = {
                                    old: old,
                                    formatted: self._formatMarket(old, categoryInfo)
                                };

                                marketsByMarketId[betSelection.marketId] = processedMarket;
                            }

                            var marketSelection = _.find(processedMarket.old.marketSelections, {
                                marketSelectionID: betSelection.marketSelectionId
                            });

                            return {
                                id: marketSelection.marketSelectionID,
                                market: processedMarket.formatted,
                                sortorder: marketSelection.sortorder,
                                selectionGroup: marketSelection.selectionGroup,
                                participantID: marketSelection.participantID,
                                subparticipantID: marketSelection.subparticipantID,
                                repositoryItemID: marketSelection.selectionRepositoryItemID,
                                name: marketSelection.selectionName,
                                displayName: marketSelection.selectionDisplayName,
                                subparticipantName: marketSelection.subparticipantName,
                                odds: betSelection.odds,
                                status: betSelection.status,
                                statusText: translationKeysByBetStatus[betSelection.status],
                                voidReasonID: betSelection.voidReasonID,
                                voidReasonText: betSelection.voidReasonText
                            };
                        }),
                        status: bet.status,
                        merchantBetId: bet.merchantBetId,
                        betType: bet.betType,
                        payout: bet.payout
                    };
                }),
                rejectedAmount: data.rejectedAmount,
                grantedAmount: data.grantedAmount,
                originalAmount: data.originalAmount,
                couponType: self.betHistoryService.getCouponType(data.coupon),
                potentialWin: self.betHistoryService.getPotentialWin(data.coupon),
                totalWon: self.betHistoryService.getTotalWinnings(data.coupon),
                latestDeadline: _.max(betsDeadlines),
                betStatus: self.betHistoryService.getBetStatus(data.coupon, translationKeysByBetStatus)
            }
        };
    };

    module.service('betHistoryAdapter', ['lodash', 'betHistoryService', BetHistoryAdapterClass]);

}(window.angular));
