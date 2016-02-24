
(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.betHistory');

    /**
     * @ngdoc service
     * @name sportsbook.betHistory.betHistoryProvider
     * @description Provider for the Betting services
     */
    module.provider('betHistory', function () {
        var provider = this;

        provider.merchantId = 0;
        provider.translationKeysByBetStatus = {};
        provider.translationKeysByBetFilter = {};

        this.$get = ['betHistoryService', '$q', 'applicationState', 'prematchSession', 'betHistoryAdapter', 'moment', 'lodash', function (betHistoryService, $q, applicationState, prematchSession, betHistoryAdapter, moment, _) {
            return {
                /**
                 * @ngdoc method
                 * @name sportsbook.betHistory.betHistoryService#getHistory
                 * @methodOf sportsbook.betHistory.betHistoryService
                 * @description Requests the current user's bet history from the proxy.
                 */
                getHistory: function (options) {
                    var self = this;

                    return $q.all({
                        culture: applicationState.culture(),
                        sessionInfo: prematchSession.getSessionInfo()
                    }).then(function (params) {

                        return betHistoryService.getHistory({
                            fromDate: moment(options.fromDate).format("YYYY-MM-DD"),
                            toDate: moment(options.toDate).format("YYYY-MM-DD"),
                            numberOfCoupons: options.numberOfCoupons,
                            betStatus: options.betFilter,
                            pageNumber: options.pageNumber,
                            sessionId: params.sessionInfo.token,
                            merchantId: provider.merchantId,
                            timeZone: params.culture.timeZoneStandardName
                        }).then(function (data) {
                            return betHistoryAdapter.toBetHistory(data, provider.translationKeysByBetStatus);
                        });
                    });
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.betHistory.betHistoryService#getHistoryWithDetails
                 * @methodOf sportsbook.betHistory.betHistoryService
                 * @description Requests the history and combines it with the details
                 */
                getHistoryWithDetails: function (options) {
                    var self = this;

                    return self.getHistory(options).then(function (historyResponse) {
                        return $q.all({
                                culture: applicationState.culture(),
                                sessionInfo: prematchSession.getSessionInfo()
                            })
                            .then(function (params) {
                                return $q.all(_.map(historyResponse.betHistoryItems, function (historicalCoupon) {
                                    return self.getBetDetails({
                                        id: historicalCoupon.couponId,
                                        sessionInfo: params.sessionInfo,
                                        culture: params.culture
                                    }).then(function (historicalCouponDetails) {
                                        historicalCoupon.details = historicalCouponDetails;
                                        return historicalCoupon;
                                    });
                                })).then(function (fullBetHistoryItems) {
                                    return {
                                        betHistoryItems: fullBetHistoryItems,
                                        numberOfPages: historyResponse.numberOfPages,
                                        numberOfCoupons: historyResponse.numberOfCoupons
                                    };
                                });
                            });
                    });
                },

                getTranslationKeysByBetStatus: function () {
                    return provider.translationKeysByBetStatus;
                },

                getTranslationKeysByBetFilter: function () {
                    return provider.translationKeysByBetFilter;
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.betHistory.betHistoryService#getBetDetails
                 * @methodOf sportsbook.betHistory.betHistoryService
                 * @param {object} options - Options describing the requested coupon.
                 * @param {number} options.id - The id of the requested coupon.
                 * @description Requests the details for the bet identified by the given options.
                 */
                getBetDetails: function (options) {
                    var self = this;

                    return betHistoryService.getBetDetails({
                        merchantId: provider.merchantId,
                        sessionId: options.sessionInfo.token,
                        couponId: options.id,
                        timeZone: options.culture.timeZoneStandardName,
                        segmentId: options.sessionInfo.segmentId,
                        languageCode: options.culture.languageCode
                    }).then(function (data) {
                        return betHistoryAdapter.toBetHistoryDetails(data, provider.translationKeysByBetStatus);
                    });
                }
            };
        }];
    });

}(window.angular));