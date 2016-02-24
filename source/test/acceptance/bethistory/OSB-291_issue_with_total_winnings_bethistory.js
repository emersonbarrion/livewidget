describe("OSB-291 issue with total winnings bethistory", function () {
    beforeEach(module("sportsbook.betHistory", ["betHistoryProvider", function (betHistoryProvider) {
        betHistoryProvider.merchantId = 1;
        translationKeysByBetStatus = [{
            1: "translation"
        }];

        betHistoryProvider.translationKeysByBetStatus = translationKeysByBetStatus;
    }]));

    var adapter, service, betHistoryService, couponTypes, cfg, $httpBackend, betFilters, translationKeysByBetStatus;

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

    it("should round down the potential win to two decimals ", function () {

        // Mocked single coupon with one bet
        var singleCoupon1 = {
            "bets": [{
                "stake": 5.222,
                "betSelections": [{
                    "odds": 2.323424234
                }]
            }]
        };

        // Mocked single coupon with multiple bets
        var singleCoupon2 = {
            "bets": [{
                "stake": 5.54,
                "betSelections": [{
                    "odds": 1.523425
                }]
            }, {
                "stake": 20.02,
                "betSelections": [{
                    "odds": 2.01213
                }]
            }]
        };

        expect(betHistoryService.getPotentialWin(singleCoupon1)).toBe(12.11);
        expect(betHistoryService.getPotentialWin(singleCoupon2)).toBe(48.66);

    });


});
