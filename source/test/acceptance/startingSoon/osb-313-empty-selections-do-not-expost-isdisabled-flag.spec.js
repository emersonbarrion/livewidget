describe("OSB-313 Empty selections do not expose isDisabled flag.", function () {

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

    it("should properly initialise starting soon", function (done) {
        scenarioFactory.runHomePageDataInitialisationScenario({
            givenLiveRequest: {
                betGroupIds: [257],
                categoryIds: [1],
                eventPhase: 2,
                eventSortBy: 1,
                include: "scoreboard",
                onlyEvenLineMarkets: true
            },
            givenPrematchRequest: {
                betGroupIds: [1, 5, 65, 2, 127],
                categoryIds: [1],
                eventPhase: 1,
                eventSortBy: 1,
                onlyEvenLineMarkets: false
            },
            givenWinnerListRequest: {
                betGroupIds: [562, 78],
                categoryIds: [1],
                eventPhase: 1,
                eventSortBy: 1,
                onlyEvenLineMarkets: false
            },
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
                }),
                mockApiResponseFactory.getEvent({
                    "ci": 11,
                    "sci": 222,
                    "ei": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "mi": 2,
                            "bgi": 27,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msi": 4,
                                    "so": 1
                                }),
                                mockApiResponseFactory.getSelection({
                                    "msi": 5,
                                    "so": 2
                                })
                            ]
                        })
                    ]
                })
            ],
            thenViewmodel: function (dataSet) {
                expect(dataSet.startingSoon.eventRows.length).toBe(2);

                expect(dataSet.startingSoon.eventRows[0].marketCells.length).toBe(1);
                expect(dataSet.startingSoon.eventRows[1].marketCells.length).toBe(1);

                expect(dataSet.startingSoon.eventRows[0].marketCells[0].selections).toEqual([
                    jasmine.objectContaining({
                        isDisabled: false,
                        sortOrder: 1
                    }),

                    jasmine.objectContaining({
                        isDisabled: false,
                        sortOrder: 2
                    }),

                    jasmine.objectContaining({
                        isDisabled: false,
                        sortOrder: 3
                    })
                ]);

                expect(dataSet.startingSoon.eventRows[1].marketCells[0].selections).toEqual([
                    jasmine.objectContaining({
                        isDisabled: false,
                        sortOrder: 1
                    }),

                    jasmine.objectContaining({
                        isDisabled: true
                    }),

                    jasmine.objectContaining({
                        isDisabled: false,
                        sortOrder: 2
                    })
                ]);


                done();
            }
        });
    });
});
