(function (angular) {
    "use strict";

    angular
        .module("sportsbook.bets")
        .controller("betslipCtrl", ["$scope", "initialiseBetslip", "applicationState", "sportsbookUserSettings", "$log", "couponTypes",
            function ($scope, betslip, applicationState, sportsbookUserSettings, $log, couponTypes) {

                betslip.bindScopeWatches($scope);

                $scope.couponTypes = couponTypes;
                $scope.viewModel = betslip.viewModel;
                $scope.couponState = betslip.isValid;
                $scope.selectionIdsInError = {};
                $scope.showDepositButton = false;
                $scope.errorMessages = [];
                $scope.couponBonus = betslip.bonuses;
                $scope.currencyCode = null;

                $scope.removeSelection = function (selection) {
                    betslip.remove(selection);
                };

                $scope.depositNow = function () {
                    $log.warn("Deposit flow to be implemented at a later stage.");
                };

                $scope.contactCustomerSupport = function () {
                    $log.warn("Customer support button will be implemented at a later stage.");
                };

                $scope.goToMyAccount = function () {
                    $log.warn("My account button will be implemented at a later stage.");
                };

                $scope.submitCoupon = function () {
                    if (!betslip.isSubmittingCoupon()) {
                        $scope.$broadcast("placing-bet-working");
                        $scope.errorMessages.length = 0;

                        var options = {};

                        if ($scope.viewModel.containsLiveSelection) {
                            options.acceptOddsChanges = $scope.acceptOddsChanges;
                        }

                        betslip.submitCoupon(options).then(
                            function (response) {
                                $scope.viewModel = betslip.reset();
                            },
                            function (errors) {
                                $scope.errorMessages = errors;
                                $scope.selectionIdsInError = {};
                                _.each(errors, function (error) {
                                    if (_.isEmpty(error.key)) {
                                        error.key = "betslip.place-bet-failed";
                                    }
                                    $scope.selectionIdsInError[error.params.selectionId] = true;
                                });

                                _.forEach($scope.errorMessages, function (error) {
                                    if (_.includes(["SBCP:-2", "SBCS:-3"], error.code)) {
                                        applicationState.user().then(function (user) {
                                            error.params.depositBalance = user.details.balance.totalFunds.amount;
                                        });
                                    }
                                });
                            }
                        ).finally(function () {
                            $scope.$broadcast("placing-bet-ready");
                        });
                    }
                };

                $scope.switchType = function (type) {
                    $scope.viewModel = betslip.convertTo(type);
                };

                $scope.showError = function (selectionId) {
                    return $scope.selectionIdsInError[selectionId];
                };

                $scope.saveAcceptOddChanges = function () {
                    sportsbookUserSettings.acceptOddsChanges = $scope.acceptOddsChanges;
                };

                $scope.toggleBonus = function (bonus) {
                    betslip.toggleBonus(bonus);
                };

                function resetErrorVariables() {
                    $scope.selectionIdsInError = {};
                }

                function handleClientSideErrors() {
                    var selectionIdsInError = {};
                    $scope.errorMessages.length = 0;

                    _.each(betslip.validationStatus, function (validationStatus) {
                        if (!validationStatus.passed) {
                            _.each(validationStatus.violations, function (violation) {
                                selectionIdsInError[violation] = true;
                            });

                            _.each(validationStatus.affected, function (affectee) {
                                selectionIdsInError[affectee] = true;
                            });

                            $scope.errorMessages.push({
                                key: validationStatus.messageKey
                            });

                        }
                    });

                    $scope.selectionIdsInError = selectionIdsInError;
                }

                function doesCouponHaveViolations() {
                    var hasViolations = _.any(betslip.validationStatus, function (validationStatus) {
                        return validationStatus.violations.length > 0;
                    });

                    return hasViolations;
                }

                function updateCurrencyCodeFromUser(user) {
                    if (user.isAuthenticated) {
                        $scope.currencyCode = user.details.currencyCode;
                    } else {
                        applicationState.culture().then(function (culture) {
                            $scope.currencyCode = culture.currencyCode;
                        });
                    }
                }

                $scope.$on("betslip-changed", function () {
                    if (doesCouponHaveViolations()) {
                        handleClientSideErrors();
                    } else {
                        resetErrorVariables();
                    }
                });

                $scope.$on("betslip-submit-coupon-success", function (event, response) {
                    $log.debug("'betslip-submit-coupon-success' was fired with", response);
                });

                $scope.$on("betslip-submit-coupon-failed", function (event, errors) {
                    $log.debug("'betslip-submit-coupon-failed' was fired with", errors);
                });

                $scope.$on("ssk-manual-attest-submit", function (event) {
                    $scope.submitCoupon();
                });

                if (doesCouponHaveViolations()) {
                    handleClientSideErrors();
                }

                applicationState.user.subscribe(updateCurrencyCodeFromUser, true);

            }
        ]);

})(window.angular);