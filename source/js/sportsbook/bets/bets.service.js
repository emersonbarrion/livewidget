(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.bets");

    // declare the default BetsService class
    var BetsServiceClass = function ($http, $q, $rootScope, apiConfig, lodash, prematchSession, pollUntilPromiseFactory, applicationState) {
        // store the injected dependencies
        this.$http = $http;
        this.$q = $q;
        this.$rootScope = $rootScope;

        this.lodash = lodash;
        this.applicationState = applicationState;
        this.apiConfig = apiConfig;
        this.prematchSession = prematchSession;
        this.pollUntilPromiseFactory = pollUntilPromiseFactory;

        this.statusRequestsByCoupon = {};
        this.submittingCoupon = false;
    };

    BetsServiceClass.prototype.isSubmittingCoupon = function () {
        return this.submittingCoupon;
    };

    BetsServiceClass.prototype.submitCoupon = function (getStatusNumberOfRetries, getStatusTimeoutPerRetry, options) {
        /// <summary>Submits the current coupon to the proxy.</summary>
        /// <summary>The "sending" variable in the scope will be set to true while the request is running.</summary>

        var self = this;

        if (self.submittingCoupon) {
            return self.$q.reject([self.transformError("OBG:400")]);
        }

        self.submittingCoupon = true;

        return self.applicationState.user().then(function (user) {
            if (!user.isAuthenticated) {
                return self.$q.reject([self.transformError("OBG:403")]);
            }

            return self.prematchSession.getSessionInfo().then(function (sessionInfo) {
                var payload = {
                    sessionId: sessionInfo.token,
                    segmentId: sessionInfo.segmentId,
                    isMobile: false,
                    ipAddress: "",
                    currency: user.details.currencyCode
                };

                if (options) {
                    payload.acceptOddsChanges = options.acceptOddsChanges;
                    payload.coupon = options.coupon;
                    payload.isForManualAttest = options.isForManualAttest;
                }

                return payload;
            });
        }).then(function (payload) {
            return self.place(payload);
        }).then(function (result) {
            if (result.isSuccess) {
                return self.getStatus(result.referenceId, getStatusNumberOfRetries, getStatusTimeoutPerRetry).then(function (response) {
                    if (response.status === "Success") {
                        return response;
                    } else {
                        var manualAttestOptions = (response.options) ? response.options : null; // get the options available for manual attest
                        var transformedErrors = _.map(response.errors, function (serverError) {
                            return self.transformCouponStatusError(serverError, response.couponId, manualAttestOptions);
                        });
                        return self.$q.reject(transformedErrors);
                    }
                }, function (data) {
                    // TODO: should we consider setting the error code to data.status?
                    return self.$q.reject([self.transformError("OBG:500")]);
                });
            } else {
                return self.$q.reject([self.transformCouponPlacementError(result)]);
            }
        }).finally(function () {
            self.submittingCoupon = false;
        });
    };

    BetsServiceClass.prototype.place = function (payload) {
        var self = this;

        return self.apiConfig.directUrlFor({
            path: "/coupon"
        }).then(function (url) {
            return self.$http({
                method: "POST",
                url: url,
                data: payload
            }).then(function (response) {
                return response.data;
            }).catch(function (data) {
                // TODO: should we consider setting the error code to data.status?
                return self.$q.reject([self.transformError("OBG:500")]);
            });
        });
    };

    BetsServiceClass.prototype.getStatus = function (couponGuid, numberOfRetries, timeoutPerRetry) {
        var self = this;

        if (!this.statusRequestsByCoupon[couponGuid]) {
            this.statusRequestsByCoupon[couponGuid] = self.pollUntilPromiseFactory(
                function () {
                    return self.apiConfig.directUrlFor({
                        path: "/couponplacementstatus/" + couponGuid
                    }).then(function (url) {
                        return self.$http({
                            method: "GET",
                            url: url
                        }).then(function (response) {
                            return response.data;
                        });
                    });
                },
                function (data) {
                    return data.status;
                },
                numberOfRetries,
                timeoutPerRetry
            );
        }

        return this.statusRequestsByCoupon[couponGuid];
    };

    BetsServiceClass.prototype.transformCouponPlacementError = function (serverError) {
        return this.transformError("SBCP:" + serverError.errorCode, serverError.errorParams, serverError.referenceId);
    };

    BetsServiceClass.prototype.transformCouponStatusError = function (serverError, couponGuid, manualAttestOptions) {
        if (manualAttestOptions) {
            if (!serverError.errorParams.options) {
                serverError.errorParams.options = {};
            }
            serverError.errorParams.options = _.assign(serverError.errorParams.options, manualAttestOptions);
        }
        return this.transformError("SBCS:" + serverError.errorCode, serverError.errorParams, couponGuid);
    };

    BetsServiceClass.prototype.transformError = function (code, params, couponGuid) {
        if (!params) {
            params = {};
        }
        if (!couponGuid) {
            couponGuid = null;
        }
        var transformedError = {
            "code": code,
            "params": params,
            "couponGuid": couponGuid
        };
        return transformedError;
    };

    /**
     * @ngdoc service
     * @name sportsbook.bets:betsService
     * @description bets factory to be consumed by the betsProvider
     */
    module.service("betsService", ["$http", "$q", "$rootScope", "apiConfig", "lodash", "prematchSession", "pollUntilPromiseFactory", "applicationState", BetsServiceClass]);

})(window.angular);