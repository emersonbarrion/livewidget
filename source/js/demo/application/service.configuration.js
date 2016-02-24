
(function (angular) {
    "use strict";

    angular
        .module("sportsbook.configuration")
        .config(["applicationStateProvider", function (applicationStateProvider) {

            // Register sportsbook specific application states.
            var state = applicationStateProvider.$get();
            state._registerProperty("live");
            state._registerProperty("category");
            state._registerProperty("region");
            state._registerProperty("competition");
            state._registerProperty("event");
        }]);

    angular
        .module("sportsbook.betHistory")
        .config(["betHistoryProvider", "betStatus", "betFilters", function (betHistoryProvider, betStatus, betFilters) {
            betHistoryProvider.merchantId = 7;

            betHistoryProvider.translationKeysByBetStatus = {};

            betHistoryProvider.translationKeysByBetStatus[betStatus.OPEN] = "Open";
            betHistoryProvider.translationKeysByBetStatus[betStatus.WON] = "Won";
            betHistoryProvider.translationKeysByBetStatus[betStatus.LOST] = "Lost";
            betHistoryProvider.translationKeysByBetStatus[betStatus.VOID] = "Void";
            betHistoryProvider.translationKeysByBetStatus[betStatus.MANUAL_REVIEW] = "Manualreview";
            betHistoryProvider.translationKeysByBetStatus[betStatus.MANUAL_REJECTED] = "Rejected";
            betHistoryProvider.translationKeysByBetStatus[betStatus.MANUAL_GRANTED] = "Granted";
            betHistoryProvider.translationKeysByBetStatus[betStatus.HALF_WON] = "HalfWon";
            betHistoryProvider.translationKeysByBetStatus[betStatus.HALF_LOST] = "HalfLost";

            betHistoryProvider.translationKeysByBetFilter = {};

            betHistoryProvider.translationKeysByBetFilter[betFilters.ALL] = "All";
            betHistoryProvider.translationKeysByBetFilter[betFilters.OPEN] = "Open";
            betHistoryProvider.translationKeysByBetFilter[betFilters.WON] = "Won";
            betHistoryProvider.translationKeysByBetFilter[betFilters.LOST] = "Lost";
            betHistoryProvider.translationKeysByBetFilter[betFilters.VOID] = "Void";
        }]);


    angular
        .module("sportsbook.validations")
        .config(["couponValidationProvider", function (couponValidationProvider) {
            couponValidationProvider.messageKeyByRuleId = {
                "default": "betslip.place-bet-failed",
                "not_same_subcategory_restriction": "betslip.related-outcomes-message",
                "cannot_combine": "betslip.related-outcomes-message",
                "not_same_event_restriction": "betslip.related-outcomes-message",
                "not_same_participant_restriction": "betslip.related-outcomes-message",
                "not_on_hold_restriction": "betslip.on-hold-message"
            };
        }]);

    angular
        .module("sportsbook.bets")
        .config(["betsProvider", "couponPlacementErrorFormatterProvider", function (betsProvider, couponPlacementErrorFormatterProvider) {
            betsProvider.getStatusNumberOfRetries = 24;
            betsProvider.getStatusTimeoutPerRetry = 5000;

            couponPlacementErrorFormatterProvider.errorConfigurationByCode = {
                "OBG:403": {
                    key: "betslip.account-not-logged-in"
                },
                "OBG:500": {
                    key: "betslip.error-general"
                },
                "SBCP:-1": {
                    key: "betslip.error.incorrect-currency"
                },
                "SBCP:-2": {
                    key: "ssk.betslip.not-enough-funds",
                    options: {
                        showDepositButton: true
                    }
                },
                "SBCP:-10": {
                    key: "ssk.betslip.error.max-payout-reached"
                },
                "SBCP:-11": {
                    key: "ssk.betslip.error.minimum-stake-allowed"
                },
                "SBCP:-12": {
                    key: "ssk.betslip.error.maximum-stake-reached"
                },
                "SBCP:-13": {
                    key: "betslip.error.maximum-bets-reached"
                },
                "SBCP:-14": {
                    key: "betslip.error.maximum-selections"
                },
                "SBCS:-3": {
                    key: "ssk.betslip.not-enough-funds",
                    options: {
                        showDepositButton: true
                    }
                },
                "SBCS:5007": {
                    key: "betslip.account-not-active",
                    options: {
                        showCustomerSupportButton: true,
                        showMyAccountButton: true
                    }
                },
                "SBCS:6004": {
                    key: "betslip.market-deadline-passed"
                },
                "SBCS:6007": {
                    key: "betslip.market-not-open"
                },
                "SBCS:6010": {
                    key: "betslip.odds-change-message"
                },
                "SBCS:6011": {
                    key: "betslip.risk-limit-reached"
                },
                "SBCS:6015": {
                    key: "ssk.betslip.maximum-stake-reached"
                },
                "SBCS:6018": {
                    key: "betslip.invalid-odds"
                },
                "SBCS:9001": {
                    key: "betslip.manual-attest-rejected"
                }
            };
        }]);

})(window.angular);