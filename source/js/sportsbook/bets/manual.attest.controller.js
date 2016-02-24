
(function (angular) {
    "use strict";

    var sportsbookControllers = angular.module("sportsbook.bets");

    /* istanbul ignore next */
    sportsbookControllers.controller("manualAttestController", [
        "$scope", "$rootScope", "lodash", "betslip", "applicationState", "couponTypes",
        function ($scope, $rootScope, _, betslip, applicationState, couponTypes) {

            $scope.command = {
                "action": ""
            };
            $scope.isVisible = false;
            $scope.allowResubmitAllowedStake = false;
            $scope.allowResubmitAllowedStakeAndRestForManualReview = false;
            $scope.allowResubmitAllForManualReview = false;

            $scope.close = function () {
                $scope.isVisible = false;
                $scope.command.action = "";
            };

            $scope.submit = function () {
                $scope.isVisible = false;
                switch ($scope.command.action) {
                    case "resubmitAllowedStakeOnly":
                        switch (betslip.couponType) {
                            case couponTypes.single:
                                $scope.bet.stake = $scope.allowedStake;
                                $scope.bet.stakeForReview = 0;
                                break;
                            case couponTypes.combi:
                            case couponTypes.system:
                                betslip.viewModel.stake = $scope.allowedStake;
                                betslip.viewModel.stakeForReview = 0;
                                break;
                        }

                        betslip.viewModel.isForManualAttest = false;
                        break;
                    case "resubmitAllowedStakeAndSendRestForManualReview":
                        switch (betslip.couponType) {
                            case couponTypes.single:
                                $scope.bet.stake = $scope.allowedStake;
                                $scope.bet.stakeForReview = $scope.valueToAttest;

                                break;
                            case couponTypes.combi:
                            case couponTypes.system:
                                betslip.viewModel.stake = $scope.allowedStake;
                                betslip.viewModel.stakeForReview = $scope.valueToAttest;

                                break;
                        }

                        betslip.viewModel.isForManualAttest = true;
                        break;

                    case "resubmitAllForReview":
                        switch (betslip.couponType) {
                            case couponTypes.single:
                                $scope.bet.stakeForReview = $scope.bet.stake;
                                $scope.bet.stake = 0;
                                break;
                            case couponTypes.combi:
                            case couponTypes.system:
                                betslip.viewModel.stakeForReview = betslip.viewModel.stake;
                                betslip.viewModel.stake = 0;

                                break;
                        }

                        betslip.viewModel.isForManualAttest = true;
                        break;
                }

                $scope.command.action = "";
                $scope.$broadcast("ssk-manual-attest-submit");
            };

            $scope.$on("betslip-submit-coupon-failed", function (event, errors) {

                // $scope.allowedStake = (errors[0].params.allowedStake) ? errors[0].params.allowedStake : errors[0].params.AllowedStake;
                // var allowedStakePresent = _.isNumber($scope.allowedStake) && ($scope.allowedStake > 0);
                //
                // $scope.allowResubmitAllowedStake = _.contains(response.options, "Sportsbook.PlaceCoupon.Option.Msg6011_1") && allowedStakePresent;
                // $scope.allowResubmitAllowedStakeAndRestForManualReview = _.contains(response.options, "Sportsbook.PlaceCoupon.Option.Msg6011_2") && allowedStakePresent;
                // $scope.allowResubmitAllForManualReview = _.contains(response.options, "Sportsbook.PlaceCoupon.Option.Msg6011_3");
                //
                // $scope.isVisible = ($scope.allowResubmitAllowedStake || $scope.allowResubmitAllowedStakeAndRestForManualReview || $scope.allowResubmitAllForManualReview);
                //
                // applicationState.user().then(function (user) {
                //     $scope.currency = user.details.currencyCode;
                // });
                //
                // $scope.stake = betslip.viewModel.stake;
                //
                // if (betslip.couponType === couponTypes.single) {
                //     var selectionId = errors[0].params.marketSelectionId;
                //
                //     $scope.selection = betslip.viewModel.selections[selectionId];
                //     $scope.bet = betslip.viewModel.bets[selectionId];
                //
                //     $scope.stake = parseFloat($scope.bet.stake);
                // }
                //
                // $scope.valueToAttest = $scope.stake - $scope.allowedStake;
                //

                var manualAttestError = _.find(errors, function (error) {
                    return _.includes(["SBCS:6010", "SBCS:6011"], error.code);
                });

                if (!manualAttestError) {
                    return;
                }

                $scope.allowedStake = manualAttestError.params.allowedStake;
                var allowedStakePresent = _.isNumber($scope.allowedStake) && ($scope.allowedStake > 0);

                $scope.allowResubmitAllowedStake = _.includes(manualAttestError.params.options, "Sportsbook.PlaceCoupon.Option.Msg6011_1") && allowedStakePresent;
                $scope.allowResubmitAllowedStakeAndRestForManualReview = _.includes(manualAttestError.params.options, "Sportsbook.PlaceCoupon.Option.Msg6011_2") && allowedStakePresent;
                $scope.allowResubmitAllForManualReview = _.includes(manualAttestError.params.options, "Sportsbook.PlaceCoupon.Option.Msg6011_3");

                $scope.isVisible = ($scope.allowResubmitAllowedStake || $scope.allowResubmitAllowedStakeAndRestForManualReview || $scope.allowResubmitAllForManualReview);

                applicationState.user().then(function (user) {
                    $scope.currency = user.details.currencyCode;
                });

                $scope.stake = betslip.viewModel.stake;

                if (betslip.couponType === couponTypes.single) {
                    var selectionId = manualAttestError.params.marketSelectionId;

                    $scope.selection = betslip.viewModel.selections[selectionId];
                    $scope.bet = betslip.viewModel.bets[selectionId];

                    $scope.stake = parseFloat($scope.bet.stake);
                }

                $scope.valueToAttest = $scope.stake - $scope.allowedStake;

            });
        }
    ]);
})(window.angular);