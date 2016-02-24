describe("Services: Betslip service", function () {
    var eventsResource, eventDataSourceManager, $rootScope, $q, testData;

    function getTestData() {
        var event1 = {
            id: 1
        };
        var event2 = {
            id: 2
        };

        var market1 = {
            id: 1,
            eventId: 1,
            ruleId: 0,
            betGroup: {
                id: 1
            }
        };
        var market2 = {
            id: 2,
            eventId: 1,
            ruleId: 0,
            betGroup: {
                id: 2
            }
        };
        var market3 = {
            id: 3,
            eventId: 2,
            ruleId: 0,
            betGroup: {
                id: 1
            }
        };

        event1.markets = [market1, market2];
        event2.markets = [market3];

        var testSelection1 = {
            id: 1,
            eventId: 1,
            ruleId: 0,
            name: "Selection 1",
            marketId: 1,
            odds: 2.0,
            getParent: function () {
                return market1;
            }
        };
        var testSelection2 = {
            id: 2,
            eventId: 1,
            ruleId: 0,
            name: "Selection 2",
            marketId: 2,
            odds: 3.0,
            getParent: function () {
                return market2;
            }
        };
        var testSelection3 = {
            id: 3,
            eventId: 2,
            ruleId: 0,
            name: "Selection 3",
            marketId: 3,
            odds: 5.0,
            getParent: function () {
                return market3;
            }
        };

        market1.selections = [testSelection1];
        market2.selections = [testSelection2];
        market3.selections = [testSelection3];

        return {
            events: [event1, event2],
            selections: [testSelection1, testSelection2, testSelection3],
            initialDataSet: {
                1: {
                    markets: {
                        1: {
                            betGroupId: 1,
                            selections: {
                                1: true
                            }
                        },
                        2: {
                            betGroupId: 2,
                            selections: {
                                2: true
                            }
                        }
                    }
                },
                2: {
                    markets: {
                        3: {
                            betGroupId: 1,
                            selections: {
                                3: true
                            }
                        }
                    }
                }
            }
        };
    }

    beforeEach(module("sportsbook.betslip"));

    beforeEach(inject(["eventsResource", "eventDataSourceManager", "$rootScope", "applicationState", "$q", "prematchSession",
        function (_eventsResource_, _eventDataSourceManager_, _$rootScope_, applicationState, _$q_, prematchSession) {
            $q = _$q_;

            eventsResource = _eventsResource_;
            $rootScope = _$rootScope_;

            testData = getTestData();

            spyOn(applicationState, "culture").and.returnValue($q.when({
                languageCode: "en"
            }));

            spyOn(applicationState, "user").and.returnValue($q.when({
                "isAuthenticated": false
            }));
            spyOn(prematchSession, "getSessionInfo").and.returnValue($q.when({
                "segmentId": 601,
                "token": "TEST_TOKEN"
            }));
        }
    ]));

    describe("initialization", function () {

        describe("persistence", function () {

            describe("no coupon in storage", function () {

                var persistence;
                var cache = {
                    get: function () {}
                };

                beforeEach(inject([
                    "CacheFactory",
                    function (cacheFactory) {
                        persistence = cacheFactory;
                        spyOn(persistence, "get").and.returnValue(cache);
                        spyOn(cache, "get").and.returnValue(null);
                    }
                ]));

                it("Should initialize an empty single coupon if there are no persisted coupons.", function (done) {
                    inject([
                        "betslip",
                        function (service) {
                            spyOn(eventsResource, "query");
                            spyOn(service, '_checkForBonuses').and.returnValue($q.when({
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

                            service.initialise().then(function () {

                                expect(service.couponType).toBe(0);
                                expect(service.viewModel).toBeDefined();
                                expect(service.viewModel.numberOfSelections).toBe(0);

                                expect(eventsResource.query).not.toHaveBeenCalled();
                                done();
                            });

                            $rootScope.$digest();
                        }
                    ]);
                });
            });

            describe("coupon available in storage", function () {

                it("Should initialize a coupon based on the persisted coupon.", function (done) {
                    inject([
                        "betslip", "sportsbookUserSettings",
                        function (service, sportsbookUserSettings) {
                            spyOn(service, '_checkForBonuses').and.returnValue($q.when({
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

                            sportsbookUserSettings.coupon = {
                                "type": 1,
                                "data": {
                                    "1": {
                                        "markets": {
                                            "1": {
                                                "betslipOrder": 1,
                                                "selections": {
                                                    "1": true
                                                }
                                            },
                                            "2": {
                                                "betslipOrder": 2,
                                                "selections": {
                                                    "2": true
                                                }
                                            }
                                        }
                                    }
                                }
                            };

                            var event = {
                                id: 1,
                                markets: [{
                                    id: 1,
                                    betGroup: {
                                        id: 1
                                    },
                                    eventId: 1,
                                    selections: [{
                                        id: 1,
                                        ruleId: 0,
                                        betGroupId: 1,
                                        eventId: 1,
                                        marketId: 1,
                                        name: "Selection 1"
                                    }]
                                }, {
                                    id: 2,
                                    betGroup: {
                                        id: 2
                                    },
                                    eventId: 1,
                                    selections: [{
                                        id: 2,
                                        ruleId: 0,
                                        betGroupId: 2,
                                        eventId: 1,
                                        marketId: 2,
                                        name: "Selection 2"
                                    }]
                                }]
                            };

                            event.markets[0].selections[0].getParent = function () {
                                return event.markets[0];
                            };
                            event.markets[1].selections[0].getParent = function () {
                                return event.markets[1];
                            };

                            spyOn(eventsResource, "query").and.returnValue($q.when([event]));

                            service.initialise().then(function () {
                                var viewModel = service.viewModel;

                                expect(viewModel).toBeDefined();
                                expect(viewModel).not.toBeNull();

                                expect(service.couponType).toBe(1);

                                expect(viewModel.numberOfSelections).toBe(2);

                                expect(service.selectionsByMarketId.content[1]).toEqual(jasmine.objectContaining({
                                    id: 1
                                }));
                                expect(service.selectionsByMarketId.content[2]).toEqual(jasmine.objectContaining({
                                    id: 2
                                }));

                                done();
                            });

                            $rootScope.$digest();
                        }
                    ]);
                });
            });
        });

    });

    describe("validation", function () {

        var validator;
        var validationResult = [{
            "ok": true
        }];

        beforeEach(inject([
            "couponValidation",
            function (couponValidator) {

                validator = couponValidator;
                spyOn(couponValidator, "validate").and.returnValue(validationResult);
                spyOn(couponValidator, "testSelection");
            }
        ]));

        it("Should initialize an empty single coupon if there are no persisted coupons.", function (done) {
            inject([
                "betslip",
                function (service) {
                    spyOn(service, '_checkForBonuses').and.returnValue($q.when({
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
                    spyOn(eventsResource, "query").and.returnValue({
                        $promise: $q.when([])
                    });
                    service.initialise().then(function () {
                        expect(service.validationStatus).toEqual(validationResult);
                        expect(validator.validate).toHaveBeenCalledWith(service);

                        done();
                    });

                    $rootScope.$digest();
                }
            ]);
        });
    });

    describe("change hooks", function () {

        var rootScope, service;

        beforeEach(inject([
            "$rootScope", "betslip",
            function ($rootScope, betslipService) {
                service = betslipService;
                spyOn(service, '_checkForBonuses').and.returnValue($q.when({
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

                rootScope = $rootScope;

                spyOn(eventsResource, "query").and.returnValue({
                    $promise: $q.when([])
                });
                service.initialise();

                rootScope.$digest();

                spyOn(service, "$afterChange");
            }
        ]));

        it("should process changes after a selection is added.", function () {
            var testSelection = testData.selections[0];

            service.add(testSelection);

            rootScope.$digest();

            expect(service.$afterChange).toHaveBeenCalled();
        });

        it("should process changes after a selection is removed.", function () {
            var testSelection = testData.selections[0];

            service.add(testSelection);
            rootScope.$digest();

            service.remove(testSelection);
            rootScope.$digest();

            expect(service.$afterChange).toHaveBeenCalled();
        });

        it("should process changes if the coupon type changes.", function () {
            service.convertTo(2);

            rootScope.$digest();

            expect(service.$afterChange).toHaveBeenCalled();
        });
    });

    describe("adding and removing", function () {

        var service;

        beforeEach(inject(["betslip", function (betslipService) {
            service = betslipService;
            spyOn(service, '_checkForBonuses').and.returnValue($q.when({
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

            spyOn(eventsResource, "query").and.returnValue({
                $promise: $q.when([])
            });
            service.initialise();

            $rootScope.$digest();
        }]));

        it("Toggle should add and remove based on the status of the selection in the coupon.", function () {
            var selectionToAdd = testData.selections[0];
            var selectionToRemove = testData.selections[1];

            spyOn(service, "add");
            spyOn(service, "remove");

            spyOn(service, "isInCoupon").and.callFake(function (s) {
                return s === selectionToRemove;
            });

            service.toggle(selectionToAdd);
            expect(service.add).toHaveBeenCalledWith(selectionToAdd);

            service.toggle(selectionToRemove);
            expect(service.remove).toHaveBeenCalledWith(selectionToRemove);
        });

        it("should fire the appropriate event when adding a selection", function (done) {
            var testSelection = testData.selections[0];

            $rootScope.$on("betslip-changed", function (event, data) {
                expect(data.command).toBe("added");
                expect(data.selection).toBe(testSelection);
                done();
            });

            service.add(testSelection);
            $rootScope.$digest();
        });

        it("should fire the appropriate event when removing a selection", function () {
            var testSelection = testData.selections[0];

            service.add(testSelection);
            $rootScope.$digest();

            $rootScope.$on("betslip-changed", function (event, data) {
                expect(data.command).toBe("removed");
                expect(data.selection).toBe(testSelection);
            });

            service.remove(testSelection);
            $rootScope.$digest();
        });

        it("should not fire an event when removing a selection, if nothing has actually changed", function () {
            spyOn($rootScope, "$broadcast");

            service.remove(testData.selections[0]);
            $rootScope.$digest();

            expect($rootScope.$broadcast).not.toHaveBeenCalledWith("betslip-changed");
        });

    });

    describe("enquiries", function () {

        var service;

        beforeEach(inject(["betslip", function (betslipService) {
            service = betslipService;
            spyOn(service, '_checkForBonuses').and.returnValue($q.when({
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

            spyOn(eventsResource, "query").and.returnValue({
                $promise: $q.when([])
            });
            service.initialise().then(function () {
                service.add({
                    "id": 1,
                    "odds": 0.5,
                    "marketId": 1,
                    "ruleId": 0,
                    getParent: function () {
                        return {
                            "id": 1
                        };
                    }
                });
            });

            $rootScope.$digest();
        }]));

        var otherSelection = {
            "id": 1,
            "odds": 0.5,
            "marketId": 1,
            "ruleId": 0,
            getParent: function () {
                return {
                    "id": 1,
                    "ruleId": 0
                };
            }
        };

        it("should mark a selection as eligible if is already selected.", function () {
            spyOn(service, "isMarketInCoupon").and.returnValue(true);
            spyOn(service.validator, "testSelection");

            expect(service.isEligible(otherSelection)).toBe(true);
            expect(service.isMarketInCoupon).toHaveBeenCalledWith(otherSelection);
            expect(service.validator.testSelection).not.toHaveBeenCalled();
        });

        it("should mark a selection as eligible if adding it does not violate any rules.", function () {
            spyOn(service, "isMarketInCoupon").and.returnValue(false);
            spyOn(service.validator, "testSelection").and.returnValue([{
                "passed": true
            }]);

            expect(service.isEligible(otherSelection)).toBe(true);
            expect(service.isMarketInCoupon).toHaveBeenCalledWith(otherSelection);
            expect(service.validator.testSelection).toHaveBeenCalledWith(otherSelection, service);
        });

        it("should mark a selection as eligible if adding it violates any rules.", function () {
            spyOn(service, "isMarketInCoupon").and.returnValue(false);
            spyOn(service.validator, "testSelection").and.returnValue([{
                "passed": true
            }, {
                "passed": false
            }, {
                "passed": true
            }]);

            expect(service.isEligible(otherSelection)).toBe(false);
            expect(service.isMarketInCoupon).toHaveBeenCalledWith(otherSelection);
            expect(service.validator.testSelection).toHaveBeenCalledWith(otherSelection, service);
        });

        it("should determine whether the given selection is in the coupon", function () {
            expect(service.isInCoupon({
                "id": 1,
                "odds": 0.5,
                "marketId": 2
            })).toBe(false);
            expect(service.isInCoupon({
                "id": 2,
                "odds": 0.5,
                "marketId": 1
            })).toBe(false);
            expect(service.isInCoupon({
                "id": 1,
                "odds": 0.5,
                "marketId": 1
            })).toBe(true);
        });

        it("should determine if any of the given selections is in the coupon", function () {
            expect(service.isInCoupon([{
                "marketId": 2,
                "id": 1,
                "odds": 0.5
            }, {
                "marketId": 1,
                "id": 2,
                "odds": 0.5
            }])).toBe(false);

            expect(service.isInCoupon([{
                "marketId": 2,
                "id": 1,
                "odds": 0.5
            }, {
                "marketId": 1,
                "id": 1,
                "odds": 0.5
            }])).toBe(true);
        });
    });

    describe("data merging", function () {
        var providerService, cache;

        beforeEach(inject(["CacheFactory", function (cacheFactory) {
            cache = {};

            spyOn(cacheFactory, "get").and.returnValue({
                get: function (key) {
                    return cache[key];
                },
                put: function (key, value) {
                    return cache[key] = value;
                }
            });
        }]));

        beforeEach(inject([
            "betslip", "eventDataSourceManager",
            function (_providerService_, _eventDataSourceManager_) {
                eventDataSourceManager = _eventDataSourceManager_;
                providerService = _providerService_;
            }
        ]));

        beforeEach(function () {

            spyOn(eventsResource, "query").and.returnValue({
                $promise: $q.when(testData.events)
            });

            spyOn(eventsResource, "query").and.returnValue({
                $promise: $q.when(testData.events)
            });
        });
    });
});
