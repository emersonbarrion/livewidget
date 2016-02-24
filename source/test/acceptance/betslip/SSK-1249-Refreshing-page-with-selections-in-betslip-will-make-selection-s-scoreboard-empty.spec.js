describe("SSK-1249 Refreshing page with selections in betslip will make selection's scoreboard empty", function () {
    beforeEach(module("sportsbook.tests"));

    var scenarioFactory,
        mockApiResponseFactory,
        couponTypes,
        testLocalStorageCouponFactory,
        $httpBackend;

    beforeEach(function () {

        inject(["scenarioFactory", "mockApiResponseFactory", "couponTypes", "testLocalStorageCouponFactory", "$httpBackend",
            function (_scenarioFactory_, _mockApiResponseFactory_, _couponTypes_, _testLocalStorageCouponFactory_, _$httpBackend_) {
                scenarioFactory = _scenarioFactory_;
                mockApiResponseFactory = _mockApiResponseFactory_;
                testLocalStorageCouponFactory = _testLocalStorageCouponFactory_;
                couponTypes = _couponTypes_;
                $httpBackend = _$httpBackend_;
            }
        ]);
    });


    it("should request the scoreboard if available", function () {

        $httpBackend.expectGET(/.*(include=scoreboard).*/);

        scenarioFactory.runBetslipInitialisationScenario({
            givenCouponInLocalStorage: testLocalStorageCouponFactory.getLocalStorageCoupon({
                data: testLocalStorageCouponFactory.getLocalStorageCouponData([{
                    eventId: 1001,
                    marketId: 1,
                    selectionId: 5000
                }])
            }),
            givenBackendState: [
                mockApiResponseFactory.getEvent()
            ],
            thenBetslip: function (betslip) {
                expect(betslip).toBeTruthy();
            }
        });
    });

});
