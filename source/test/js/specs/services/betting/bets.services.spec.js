describe("Services: Bets", function () {

    var applicationState, providerService, prematchSession, actualService, cfg, $httpBackend;

    var NUMBER_OF_RETRIES = 2;
    var TIMEOUT_PER_RETRY = 0;

    beforeEach(module("sportsbook.bets", ["betsProvider", function (betsProvider) {
        betsProvider.getStatusNumberOfRetries = NUMBER_OF_RETRIES;
        betsProvider.getStatusTimeoutPerRetry = TIMEOUT_PER_RETRY;
    }]));

    beforeEach(module("sportsbook.betslip"));
    beforeEach(module("sportsbook.markets"));

    beforeEach(inject(["apiConfig", "bets", "betsService", "$httpBackend", "$q", "prematchSession", "applicationState", function (apiConfig, bets, betsService, _$httpBackend_, $q, _prematchSession_, _applicationState_) {

        $httpBackend = _$httpBackend_;

        _$httpBackend_.when("GET", "http://www.test.com/bonus?Channel=1&matchType=0&segmentId=1&sessionId=token").respond({});

        cfg = apiConfig;

        providerService = bets;
        actualService = betsService;

        cfg.directUrlFor = function (options) {
            return $q.when("http://www.test.com" + options.path);
        };

        applicationState = _applicationState_;

        applicationState.user({
            details: {
                currencyCode: "EUR"
            },
            isAuthenticated: true
        });

        prematchSession = _prematchSession_;

        spyOn(prematchSession, 'getSessionInfo').and.returnValue($q.when({
            token: "token",
            segmentId: 1
        }));
    }]));

    describe("submitCoupon", function () {
        var $rootScope, $q, betslip;

        beforeEach(inject(["$rootScope", "$q", "betslip", function (_$rootScope_, _$q_, _betslip_) {
            betslip = _betslip_;
            betslip.initialise();
            spyOn(_betslip_, '_checkForBonuses').and.returnValue(_$q_.when({
                customerBonuses: [{
                    "customerBonusId": "7df4f971-51d9-43fb-852a-b22aaa0a7405",
                    "bonusType": "RFB",
                    "createdDate": "01/20/2015 13:37:02",
                    "expiryDate": "01/20/2015 13:37:02",
                    "bonusCriteria": 4,
                    "bonusMatchType": 0,
                    "stake": 10.0,
                    "bonusData": null
                }]
            }));
            $rootScope = _$rootScope_;
            $q = _$q_;
        }]));

        it("should resolve with a successful response on success.", function () {
            spyOn(actualService, "place").and.returnValue($q.when({
                "isSuccess": true
            }));
            spyOn(actualService, "getStatus").and.returnValue($q.when({
                "status": "Success"
            }));

            providerService.submitCoupon().then(function (response) {
                expect(response.status).toEqual("Success");
            });

            $rootScope.$digest();
        });

        it("reject with errors if coupon placement fails.", function () {
            spyOn(actualService, "place").and.returnValue($q.reject([{
                "code": "-1",
                "params": {},
                "couponGuid": null
            }]));

            providerService.submitCoupon().then(function (response) {
                fail();
            }, function (errors) {
                expect(errors.length).toBe(1);
            });

            $rootScope.$digest();
        });

        it("should reject with errors if retrieving the coupon status fails.", function () {
            spyOn(actualService, "place").and.returnValue($q.when({
                isSuccess: true
            }));
            spyOn(actualService, "getStatus").and.returnValue($q.reject());

            providerService.submitCoupon().then(function (response) {
                fail();
            }, function (errors) {
                expect(errors.length).toBe(1);
            });

            $rootScope.$digest();
        });

        it("should reject with errors if the coupon status retrieved is not successful.", function () {
            var getStatusResponse = {
                status: "Failure",
                errors: [{
                    errorCode: "1"
                }]
            };

            spyOn(actualService, "place").and.returnValue($q.when({
                isSuccess: true
            }));
            spyOn(actualService, "getStatus").and.returnValue($q.when(getStatusResponse));

            providerService.submitCoupon({
                "coupon": betslip
            }).then(function (response) {
                fail();
            }, function (errors) {
                expect(errors.length).toBe(1);
            });

            $rootScope.$digest();
        });

        it("should reject with the OBG:403 error for authentication errors.", function () {
            applicationState.user({
                details: {
                    currencyCode: "EUR"
                },
                isAuthenticated: false
            });

            providerService.submitCoupon({
                "coupon": betslip
            }).then(function (response) {
                fail();
            }, function (errors) {
                expect(errors.length).toBe(1);
                expect(errors[0].code).toBe("OBG:403");
            });

            $rootScope.$digest();
        });

        it("should not attempt to place a coupon until the previous coupon has been placed.", function () {
            spyOn(actualService, "place").and.returnValue($q.when({
                isSuccess: true
            }));
            spyOn(actualService, "getStatus").and.returnValue($q.when({
                status: "Success"
            }));

            providerService.submitCoupon({
                "coupon": betslip
            });
            expect(actualService.isSubmittingCoupon()).toBe(true);
            providerService.submitCoupon({
                "coupon": betslip
            });

            $rootScope.$digest();

            expect(actualService.place.calls.count()).toBe(1);
        });
    });

    describe("place", function () {
        it("should send place bet requests to the web service", function (done) {

            $httpBackend.when("POST", "http://www.test.com/coupon").respond({
                "ok": true
            });

            actualService.place({
                stuff: "some"
            }, NUMBER_OF_RETRIES, TIMEOUT_PER_RETRY).then(function (data) {
                expect(data.ok).toBe(true);
                done();
            });

            $httpBackend.flush();
        });

        it("should raise a rejection for failed place bet requests", function (done) {

            $httpBackend.when("POST", "http://www.test.com/coupon").respond(401);

            actualService.place({
                stuff: "some"
            }, NUMBER_OF_RETRIES, TIMEOUT_PER_RETRY).then(
                function () {},
                function (errors) {
                    expect(errors.length).toBe(1);
                    expect(errors[0].code).toEqual("OBG:500");
                    done();
                }
            );

            $httpBackend.flush();
        });
    });

    describe("getStatus", function () {
        var $timeout;

        beforeEach(inject(["$timeout", function (_$timeout_) {
            $timeout = _$timeout_;
        }]));

        it("should send coupon status requests to the web service", function (done) {

            $httpBackend.when("GET", "http://www.test.com/couponplacementstatus/1").respond({
                "status": "success"
            });

            actualService.getStatus(1, NUMBER_OF_RETRIES, TIMEOUT_PER_RETRY).then(function (data) {
                expect(data.status).toBe("success");
                done();
            });

            $httpBackend.flush();
        });

        it("should retry on a failure or if it doesn't get an answer", function () {
            var requestNumber = 0;

            $httpBackend.when("GET", "http://www.test.com/couponplacementstatus/1").respond(function () {
                requestNumber++;

                switch (requestNumber) {
                    case 1:
                        return [500];
                    case 2:
                        return [200, {}];
                    case 3:
                        return [200, {
                            "status": "success"
                        }];

                }

            });

            var callbacks = {
                success: function () {},
                failure: function () {},
            };

            spyOn(callbacks, "success");
            spyOn(callbacks, "failure");

            actualService.getStatus(1, NUMBER_OF_RETRIES, TIMEOUT_PER_RETRY).then(
                callbacks.success,
                callbacks.failure
            );

            $httpBackend.flush();

            expect(callbacks.success).not.toHaveBeenCalled();
            expect(callbacks.failure).not.toHaveBeenCalled();

            $timeout.flush();
            $httpBackend.flush();

            expect(callbacks.success).not.toHaveBeenCalled();
            expect(callbacks.failure).not.toHaveBeenCalled();

            $timeout.flush();
            $httpBackend.flush();

            expect(callbacks.success).toHaveBeenCalled();
            expect(callbacks.failure).not.toHaveBeenCalled();
        });

        it("should fail if the number of retries is exhausted", function () {
            $httpBackend.when("GET", "http://www.test.com/couponplacementstatus/1").respond(500);

            var callbacks = {
                success: function () {},
                failure: function () {},
            };

            providerService.getStatusNumberOfRetries = 1;

            spyOn(callbacks, "success");
            spyOn(callbacks, "failure");

            actualService.getStatus(1, NUMBER_OF_RETRIES, TIMEOUT_PER_RETRY).then(
                callbacks.success,
                callbacks.failure
            );

            $httpBackend.flush();

            expect(callbacks.success).not.toHaveBeenCalled();
            expect(callbacks.failure).not.toHaveBeenCalled();

            $timeout.flush();
            $httpBackend.flush();

            expect(callbacks.success).not.toHaveBeenCalled();
            expect(callbacks.failure).not.toHaveBeenCalled();

            $timeout.flush();
            $httpBackend.flush();

            expect(callbacks.success).not.toHaveBeenCalled();
            expect(callbacks.failure).toHaveBeenCalled();
        });
    });
});