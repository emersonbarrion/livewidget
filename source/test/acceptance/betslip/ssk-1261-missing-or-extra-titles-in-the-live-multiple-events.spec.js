describe("SSK-1261 Missing or extra titles in the Live- multiple-events", function () {
    beforeEach(module("sportsbook.tests"));

    var scenarioFactory,
        mockApiResponseFactory,
        testLocalStorageCouponFactory,
        testCategories,
        couponTypes;

    beforeEach(function () {

        inject(["scenarioFactory", "mockApiResponseFactory", "testLocalStorageCouponFactory", "couponTypes", "$httpBackend",
            function (_scenarioFactory_, _mockApiResponseFactory_, _testLocalStorageCouponFactory_, _couponTypes_, _$httpBackend_) {
                scenarioFactory = _scenarioFactory_;
                mockApiResponseFactory = _mockApiResponseFactory_;
                testLocalStorageCouponFactory = _testLocalStorageCouponFactory_;
                couponTypes = _couponTypes_;
                $httpBackend = _$httpBackend_;
                testCategories = [
                    mockApiResponseFactory.getCategory()
                ];

                $httpBackend.when("GET", "http://isaUrl.test.com/601/en/category?eventPhase=0").respond(testCategories);
            }
        ]);
    });


    it("should remove line values from betslip selection names", function (done) {
        scenarioFactory.runBetslipInitialisationScenario({
            givenCouponInLocalStorage: testLocalStorageCouponFactory.getLocalStorageCoupon({
                data: testLocalStorageCouponFactory.getLocalStorageCouponData([{
                    marketId: 1,
                    selectionId: 5000
                }, {
                    marketId: 2,
                    selectionId: 5001
                }, {
                    marketId: 3,
                    selectionId: 5002
                }, {
                    marketId: 4,
                    selectionId: 5003
                }, {
                    marketId: 5,
                    selectionId: 5004
                }, {
                    marketId: 6,
                    selectionId: 5005
                }, {
                    marketId: 7,
                    selectionId: 5006
                }])
            }),
            givenBackendState: [
                mockApiResponseFactory.getEvent({
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "lv": "2.5",
                            "mi": 1,
                            "mn": "Over 2.5",
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 5000,
                                    "mst": "Over 2.5"
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "lv": "2.0",
                            "mi": 2,
                            "mn": "Over 2",
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 5001,
                                    "mst": "Over 2"
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "lv": "2    ",
                            "mi": 3,
                            "mn": "Over 2",
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 5002,
                                    "mst": "Over 2"
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "lv": "5",
                            "mi": 4,
                            "mn": "Over 5.0",
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 5003,
                                    "mst": "Over 5.0"
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "lv": "2",
                            "mi": 5,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 5004,
                                    "mst": "2"
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "lv": "1 - 0",
                            "mi": 6,
                            "mn": "Over 1",
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 5005,
                                    "mst": "Over 1"
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "lv": "0 - 1",
                            "mi": 7,
                            "mn": "Over -1",
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 5006,
                                    "mst": "Over -1"
                                })
                            ]
                        })
                    ]
                })
            ],
            thenBetslip: function (betslip) {
                var selectionsWithNonNumericName = [5000, 5001, 5002, 5003, 5005, 5006];

                _.forEach(selectionsWithNonNumericName, function (selection) {
                    expect(betslip.viewModel.selections[selection].marketName).toBe("Over");
                    expect(betslip.viewModel.selections[selection].name).toBe("Over");
                });

                var selectionWithNumericName = [5004];

                _.forEach(selectionWithNumericName, function (selection) {
                    expect(betslip.viewModel.selections[selection].name).toBe("2");
                });

                done();
            }
        });
    });

    it("should remove line values from the event selection names", function (done) {
        scenarioFactory.runLiveOverviewInitialisationScenario({
            givenBackendState: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "ml": [


                        mockApiResponseFactory.getMarket({
                            "lv": "2.5",
                            "mi": 1,
                            "bgi": 257,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "mst": "Over 2.5"
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "lv": "2.0",
                            "mi": 2,
                            "bgi": 2141,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "mst": "Over 2"
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "lv": "2    ",
                            "mi": 3,
                            "bgi": 507,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "mst": "Over 2"
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "lv": "5",
                            "mi": 4,
                            "bgi": 2137,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 1,
                                    "so": 1,
                                    "mst": "Over 5.0"
                                }),
                                mockApiResponseFactory.getSelection({
                                    "msi": 2,
                                    "so": 2,
                                    "mst": "5"
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "mi": 5,
                            "bgn": "I have a #line#",
                            "bgi": 2148
                        })
                    ]
                })
            ],
            thenViewmodel: function (dataSet) {
                var headers = dataSet.liveMultipleEventsTables[0].headers;

                expect(headers[0].selectionHeaders[1].name).toBe("Over");
                expect(headers[1].selectionHeaders[1].name).toBe("Over");
                expect(headers[2].selectionHeaders[1].name).toBe("Over");
                expect(headers[3].selectionHeaders[1].name).toBe("Over");
                expect(headers[3].selectionHeaders[2].name).toBe("5");
                expect(headers[4].name).toBe("I have a");

                done();
            }
        });
    });

    it("should remove line values in handicap format from the event selection names", function (done) {
        scenarioFactory.runLiveOverviewInitialisationScenario({
            givenBackendState: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "lv": "1 - 0",
                            "mi": 6,
                            "bgi": 257,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "mst": "Over 1"
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "lv": "0 - 1",
                            "mi": 7,
                            "bgi": 2141,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "mst": "Over -1"
                                })
                            ]
                        })
                    ]
                })
            ],
            thenViewmodel: function (dataSet) {
                var headers = dataSet.liveMultipleEventsTables[0].headers;

                expect(headers[0].selectionHeaders[1].name).toBe("Over");
                expect(headers[1].selectionHeaders[1].name).toBe("Over");

                done();
            }
        });
    });
});
