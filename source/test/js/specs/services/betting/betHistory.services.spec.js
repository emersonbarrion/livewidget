describe("Services: Bet History", function () {

    var adapter, service, betHistoryService, couponTypes, cfg, $httpBackend, betFilters, translationKeysByBetStatus;

    beforeEach(module("sportsbook.betHistory", ["betHistoryProvider", function (betHistoryProvider) {
        betHistoryProvider.merchantId = 1;
        translationKeysByBetStatus = [{
            1: "translation"
        }];

        betHistoryProvider.translationKeysByBetStatus = translationKeysByBetStatus;
    }]));

    beforeEach(inject(["apiConfig", "betHistory", "betHistoryAdapter", "betHistoryService", "couponTypes", "$httpBackend", "$q", "prematchSession", "applicationState", "betFilters",
        function (apiConfig, betHistory, betHistoryAdapter, _betHistoryService_, _couponTypes_, _$httpBackend_, $q, prematchSession, applicationState, _betFilters_) {

            $httpBackend = _$httpBackend_;
            cfg = apiConfig;
            service = betHistory;
            betFilters = _betFilters_;
            betHistoryService = _betHistoryService_;
            couponTypes = _couponTypes_;

            cfg.directUrlFor = function (options) {
                return $q.when("http://www.test.com" + options.path);
            };

            adapter = betHistoryAdapter;

            spyOn(adapter, 'toBetHistory').and.callFake(function (data) {
                return data;
            });

            spyOn(adapter, 'toBetHistoryDetails').and.callFake(function (data) {
                return data;
            });

            spyOn(prematchSession, 'getSessionInfo').and.returnValue($q.when({
                token: "token",
                segmentId: 1
            }));

            applicationState.culture({
                languageCode: "en"
            });
        }
    ]));

    it("should identify a combi coupon", function () {
        var combiCoupon = {
            "bets": [{
                "stake": 0,
                "stakeForReview": 0,
                "betSelections": [{
                    "marketSelectionId": 18254392,
                    "odds": 1.51,
                    "marketId": 4920694,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18254332,
                    "odds": 1.22,
                    "marketId": 2220694,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }],
                "status": 1,
                "merchantBetId": 0,
                "betType": 2,
                "payout": 0
            }],
            "bonusCustomerId": null,
            "isForManualAttest": false,
            "couponId": 251324248
        };

        expect(betHistoryService.getCouponType(combiCoupon)).toBe(1);

    });

    it("should identify a single coupon", function () {
        var singleCoupon = {
            "bets": [{
                "stake": 0,
                "stakeForReview": 0,
                "betSelections": [{
                    "marketSelectionId": 18254392,
                    "odds": 1.51,
                    "marketId": 4920694,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }],
                "status": 1,
                "merchantBetId": 0,
                "betType": 1,
                "payout": 0
            }],
            "bonusCustomerId": null,
            "isForManualAttest": false,
            "couponId": 251324248
        };

        expect(betHistoryService.getCouponType(singleCoupon)).toBe(0);
    });

    it("should identify a system coupon", function () {
        var systemCoupon = {
            "bets": [{
                "stake": 0,
                "stakeForReview": 0,
                "betSelections": [{
                    "marketSelectionId": 18257180,
                    "odds": 1.25,
                    "marketId": 4921259,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257301,
                    "odds": 1.29,
                    "marketId": 4921285,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }],
                "status": 1,
                "merchantBetId": 1,
                "betType": 2,
                "payout": 0
            }, {
                "stake": 0,
                "stakeForReview": 0,
                "betSelections": [{
                    "marketSelectionId": 18257180,
                    "odds": 1.25,
                    "marketId": 4921259,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257664,
                    "odds": 1.33,
                    "marketId": 4921363,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }],
                "status": 1,
                "merchantBetId": 2,
                "betType": 2,
                "payout": 0
            }, {
                "stake": 0,
                "stakeForReview": 0,
                "betSelections": [{
                    "marketSelectionId": 18257301,
                    "odds": 1.29,
                    "marketId": 4921285,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257664,
                    "odds": 1.33,
                    "marketId": 4921363,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }],
                "status": 1,
                "merchantBetId": 3,
                "betType": 2,
                "payout": 0
            }, {
                "stake": 0,
                "stakeForReview": 0,
                "betSelections": [{
                    "marketSelectionId": 18257180,
                    "odds": 1.25,
                    "marketId": 4921259,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257301,
                    "odds": 1.29,
                    "marketId": 4921285,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257664,
                    "odds": 1.33,
                    "marketId": 4921363,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }],
                "status": 1,
                "merchantBetId": 4,
                "betType": 3,
                "payout": 0
            }, {
                "stake": 0,
                "stakeForReview": 0,
                "betSelections": [{
                    "marketSelectionId": 18257180,
                    "odds": 1.25,
                    "marketId": 4921259,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257301,
                    "odds": 1.29,
                    "marketId": 4921285,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }],
                "status": 1,
                "merchantBetId": 5,
                "betType": 2,
                "payout": 0
            }, {
                "stake": 0,
                "stakeForReview": 0,
                "betSelections": [{
                    "marketSelectionId": 18257180,
                    "odds": 1.25,
                    "marketId": 4921259,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257664,
                    "odds": 1.33,
                    "marketId": 4921363,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }],
                "status": 1,
                "merchantBetId": 6,
                "betType": 2,
                "payout": 0
            }, {
                "stake": 0,
                "stakeForReview": 0,
                "betSelections": [{
                    "marketSelectionId": 18257301,
                    "odds": 1.29,
                    "marketId": 4921285,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257664,
                    "odds": 1.33,
                    "marketId": 4921363,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }],
                "status": 1,
                "merchantBetId": 7,
                "betType": 2,
                "payout": 0
            }, {
                "stake": 0,
                "stakeForReview": 0,
                "betSelections": [{
                    "marketSelectionId": 18257180,
                    "odds": 1.25,
                    "marketId": 4921259,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257301,
                    "odds": 1.29,
                    "marketId": 4921285,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257664,
                    "odds": 1.33,
                    "marketId": 4921363,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }],
                "status": 1,
                "merchantBetId": 8,
                "betType": 3,
                "payout": 0
            }, {
                "stake": 0,
                "stakeForReview": 0,
                "betSelections": [{
                    "marketSelectionId": 18257180,
                    "odds": 1.25,
                    "marketId": 4921259,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257301,
                    "odds": 1.29,
                    "marketId": 4921285,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }, {
                    "marketSelectionId": 18257664,
                    "odds": 1.33,
                    "marketId": 4921363,
                    "status": 1,
                    "voidReasonID": 0,
                    "voidReasonText": null
                }],
                "status": 1,
                "merchantBetId": 9,
                "betType": 3,
                "payout": 0
            }],
            "bonusCustomerId": null,
            "isForManualAttest": false,
            "couponId": 251741818
        };

        expect(betHistoryService.getCouponType(systemCoupon)).toBe(2);
    });


    it("should calculate the correct total potential win for a single coupon", function () {

        // Mocked single coupon with one bet
        var singleCoupon1 = {
            "bets": [{
                "stake": 103.56,
                "betSelections": [{
                    "odds": 2.37
                }]
            }]
        };

        // Mocked single coupon with multiple bets
        var singleCoupon2 = {
            "bets": [{
                "stake": 78.98,
                "betSelections": [{
                    "odds": 17.86
                }]
            }, {
                "stake": 51.26,
                "betSelections": [{
                    "odds": 1.09
                }]
            }]
        };

        expect(betHistoryService.getPotentialWin(singleCoupon1)).toBe(245.44);
        expect(betHistoryService.getPotentialWin(singleCoupon2)).toBe(1466.45);

    });

    it("should calculate the correct total potential win for a combi coupon", function () {

        // Mocked combi coupon
        var combiCoupon1 = {
            "bets": [{
                "stake": 28.71,
                "betSelections": [{
                    "odds": 1.13
                }, {
                    "odds": 2.56
                }]
            }]
        };

        var combiCoupon2 = {
            "bets": [{
                "stake": 1.04,
                "betSelections": [{
                    "odds": 1.85
                }, {
                    "odds": 1.75
                }, {
                    "odds": 1.75
                }, {
                    "odds": 2.15
                }, {
                    "odds": 2.00
                }, {
                    "odds": 1.80
                }, {
                    "odds": 1.90
                }, {
                    "odds": 2.45
                }, {
                    "odds": 2.05
                }, {
                    "odds": 2.05
                }, {
                    "odds": 1.85
                }, {
                    "odds": 2.05
                }, {
                    "odds": 1.80
                }, {
                    "odds": 1.70
                }, {
                    "odds": 1.95
                }, {
                    "odds": 1.29
                }, {
                    "odds": 1.80
                }, {
                    "odds": 2.45
                }, {
                    "odds": 1.85
                }, {
                    "odds": 1.90
                }]
            }]
        };

        expect(betHistoryService.getPotentialWin(combiCoupon1)).toBe(82.97);

        expect(betHistoryService.getBetTotalOdds(combiCoupon2.bets[0])).toBe(388196.35);
        expect(betHistoryService.getPotentialWin(combiCoupon2)).toBe(403724.20);

    });

    it("should calculate the correct total potential win for a system coupon", function () {

        // Mocked system coupon - complicated shiq
        var systemCoupon = {
            "bets": [{
                "stake": 5,
                "betSelections": [{
                    "odds": 1.5
                }, {
                    "odds": 2.0
                }, {
                    "odds": 2.5
                }]
            }, {
                "stake": 25,
                "betSelections": [{
                    "odds": 1.5
                }, {
                    "odds": 2.0
                }]
            }, {
                "stake": 25,
                "betSelections": [{
                    "odds": 2.0
                }, {
                    "odds": 2.5
                }]
            }, {
                "stake": 25,
                "betSelections": [{
                    "odds": 1.5
                }, {
                    "odds": 2.5
                }]
            }, {
                "stake": 50,
                "betSelections": [{
                    "odds": 1.5
                }]
            }, {
                "stake": 50,
                "betSelections": [{
                    "odds": 2.0
                }]
            }, {
                "stake": 50,
                "betSelections": [{
                    "odds": 2.5
                }]
            }]
        };

        expect(betHistoryService.getPotentialWin(systemCoupon)).toBe(631.25);

    });

    it("Should send bet history requests to the web service and apply the adapter to the data", function (done) {

        $httpBackend.when("GET", "http://www.test.com/bethistory?betStatus=2&fromDate=2001-01-01&merchantId=1&numberOfCoupons=10&pageNumber=0&sessionId=token&toDate=2001-01-01").respond({
            "ok": true
        });

        service.getHistory({
            fromDate: new Date(2001, 0, 1),
            toDate: new Date(2001, 0, 1),
            numberOfCoupons: 10,
            pageNumber: 0,
            betFilter: betFilters.WON
        }).then(function (data) {
            expect(data.ok).toBe(true);
            expect(adapter.toBetHistory).toHaveBeenCalledWith(data, translationKeysByBetStatus);
            done();
        });

        $httpBackend.flush();
    });

    it("Should raise a rejection for failed bet history requests", function (done) {

        $httpBackend.when("GET", "http://www.test.com/bethistory?betStatus=2&fromDate=2001-01-01&merchantId=1&numberOfCoupons=10&pageNumber=0&sessionId=token&toDate=2001-01-01").respond(401);

        service.getHistory({
            fromDate: new Date(2001, 0, 1),
            toDate: new Date(2001, 0, 1),
            numberOfCoupons: 10,
            pageNumber: 0,
            betFilter: betFilters.WON
        }).then(
            function () {},
            function (data) {
                expect(data.status).toBe(401);
                done();
            });

        $httpBackend.flush();
    });

    it("Should send bet history detail requests to the web service and apply the adapter to the data", function (done) {

        $httpBackend.when("GET", "http://www.test.com/bethistorydetails?couponId=1&languageCode=en&merchantId=1&segmentId=1&sessionId=token&timeZone=1").respond({
            "ok": true
        });

        var params = {
            sessionInfo: {
                token: "token",
                couponId: 1,
                segmentId: 1
            },
            culture: {
                timeZoneStandardName: 1,
                languageCode: "en"
            },
            id: 1
        };

        service.getBetDetails(params).then(function (data) {
            expect(data.ok).toBe(true);
            expect(adapter.toBetHistoryDetails).toHaveBeenCalledWith(data, translationKeysByBetStatus);

            done();
        });

        $httpBackend.flush();
    });

    it("Should raise a rejection for failed bet history detail requests", function (done) {

        $httpBackend.when("GET", "http://www.test.com/bethistorydetails?couponId=1&languageCode=en&merchantId=1&segmentId=1&sessionId=token&timeZone=1").respond(401);

        var params = {
            sessionInfo: {
                token: "token",
                couponId: 1,
                segmentId: 1
            },
            culture: {
                timeZoneStandardName: 1,
                languageCode: "en"
            },
            id: 1
        };

        service.getBetDetails(params)
            .then(
                function () {},
                function (data) {
                    expect(data.status).toBe(401);
                    done();
                });

        $httpBackend.flush();
    });

    afterEach(function () {
        jasmine.clock().uninstall();
    });
});
