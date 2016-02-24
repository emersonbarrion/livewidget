describe("OSB-410 Generalise Starting Soon view model adapter.", function () {

    beforeEach(module("sportsbook.tests"));

    var scenarioFactory,
        mockApiResponseFactory;

    beforeEach(function () {

        inject(["$httpBackend", "scenarioFactory", "mockApiResponseFactory", "initialTestMarket", "testUrlBuilder",
            function (_$httpBackend_, _scenarioFactory_, _mockApiResponseFactory_, _initialTestMarket_, _testUrlBuilder_) {
                scenarioFactory = _scenarioFactory_;
                mockApiResponseFactory = _mockApiResponseFactory_;
            }
        ]);
    });

    it("should update markets", function (done) {
        scenarioFactory.runStartingSoonUpdateScenario({
            givenStartingSoonRequest: {
                eventPhase: 1,
                categoryIds: [],
                betGroupIds: [1, 27],
                eventSortBy: 2,
                onlyEvenLineMarkets: false,
                eventCount: 3
            },
            givenInitialStartingSoonBackendState: [
                mockApiResponseFactory.getEvent({
                    "ci": 1,
                    "ei": 1,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "mi": 1,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 1,
                                    "so": 1
                                }),
                                mockApiResponseFactory.getSelection({
                                    "msi": 2,
                                    "so": 2
                                }),
                                mockApiResponseFactory.getSelection({
                                    "msi": 3,
                                    "so": 3
                                })
                            ]
                        })
                    ]
                })
            ],
            givenMarketsWereUpdated: [
                mockApiResponseFactory.getEvent({
                    "ci": 1,
                    "ei": 1,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "mi": 1,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 1,
                                    "so": 1
                                }),
                                mockApiResponseFactory.getSelection({
                                    "msi": 2,
                                    "so": 2
                                }),
                                mockApiResponseFactory.getSelection({
                                    "msi": 3,
                                    "so": 3
                                })
                            ]
                        }),
                        mockApiResponseFactory.getMarket({
                            "mi": 2,
                            "bgi": 5,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 1,
                                    "so": 1
                                }),
                                mockApiResponseFactory.getSelection({
                                    "msi": 2,
                                    "so": 2
                                })
                            ]
                        })
                    ]
                })
            ],
            thenViewmodel: function (dataSet) {

                expect(dataSet.eventRows[0].marketCells).toEqual([
                    jasmine.objectContaining({
                        isEmpty: false,
                        id: 1,
                        header: {
                            betGroupId: 1
                        }
                    }),

                    jasmine.objectContaining({
                        isEmpty: false,
                        id: 2,
                        header: {
                            betGroupId: 5
                        }
                    })
                ]);

                done();
            }
        });
    });

    it("should filter the viewmodel", function (done) {
        scenarioFactory.runStartingSoonFilterScenario({
            givenStartingSoonRequest: {
                eventPhase: 1,
                categoryIds: [],
                betGroupIds: [1, 27],
                eventSortBy: 2,
                onlyEvenLineMarkets: false,
                eventCount: 3
            },
            givenInitialStartingSoonBackendState: [
                mockApiResponseFactory.getEvent({
                    "ci": 1,
                    "ei": 1
                }),
                mockApiResponseFactory.getEvent({
                    "ci": 5,
                    "ei": 2
                })
            ],
            givenUpdateRequest: [
                mockApiResponseFactory.getEvent({
                    "ci": 1,
                    "ei": 1
                })
            ],
            givenNewFilters: [1],
            thenViewmodel: function (dataSet) {

                expect(dataSet.eventRows.length).toBe(1);

                expect(dataSet.eventRows[0].id).toBe(1);
                expect(dataSet.eventRows[0].categoryNode.id).toBe(1);

                done();
            }
        });
    });
});
