describe("SSK-1187 Keep market count updated", function () {

    beforeEach(module("sportsbook.tests"));

    var scenarioFactory,
        mockApiResponseFactory;

    beforeEach(function () {

        inject(["viewData", "$rootScope", "$httpBackend", "scenarioFactory", "eventDataSourceManager", "mockApiResponseFactory", "initialTestMarket", "testUrlBuilder",
            function (_viewData_, _$rootScope_, _$httpBackend_, _scenarioFactory_, _eventDataSourceManager_, _mockApiResponseFactory_, _initialTestMarket_, _testUrlBuilder_) {
                scenarioFactory = _scenarioFactory_;
                mockApiResponseFactory = _mockApiResponseFactory_;
            }
        ]);
    });

    it("should keep updated when the number of markets updates for the event list page", function (done) {
        scenarioFactory.runEventListPageDataUpdateScenario({
            givenFilters: {
                categoryIds: [1]
            },
            givenLiveRequest: {
                betGroupIds: [257, 2141, 507, 2137, 2148],
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
            givenInitialPrematchBackendState: [
                mockApiResponseFactory.getEvent({
                    "mc": 1
                })
            ],
            whenPrematchBackendUpdatedTo: [
                mockApiResponseFactory.getEvent({
                    "mc": 2
                })
            ],
            thenViewmodelUpdated: function (dataSet) {
                expect(dataSet.prematchMultipleEventTables.length).not.toBe(0);
                expect(_.chain(dataSet.prematchMultipleEventTables).first().get("eventRows").first().get("marketCount").value()).toBe(2);
                done();
            }
        });
    });

    it("should keep updated when the number of markets updates for the home page", function (done) {
        scenarioFactory.runHomePageDataUpdateScenario({
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
            givenInitialPrematchBackendState: [
                mockApiResponseFactory.getEvent({
                    "mc": 1
                })
            ],
            whenPrematchBackendUpdatedTo: [
                mockApiResponseFactory.getEvent({
                    "mc": 2
                })
            ],
            thenViewmodelUpdated: function (dataSet) {
                expect(dataSet.multipleEventsTables.length).not.toBe(0);
                expect(_.chain(dataSet.multipleEventsTables).first().get("eventRows").first().get("marketCount").value()).toBe(2);
                done();
            }
        });
    });

    it("should keep updated when the number of markets updates for the live page", function (done) {
        scenarioFactory.runLiveOverviewDataUpdateScenario({
            givenInitialBackendState: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "mc": 1,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "mi": 3,
                            "bgi": 257
                        })
                    ]
                })
            ],
            whenBackendUpdatedTo: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "mc": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "mi": 3,
                            "bgi": 257
                        }),
                        mockApiResponseFactory.getMarket({
                            "mi": 4,
                            "bgi": 2141
                        })
                    ]
                })
            ],
            thenViewmodelUpdated: function (dataSet) {
                expect(dataSet.liveMultipleEventsTables.length).not.toBe(0);
                expect(_.chain(dataSet.liveMultipleEventsTables).first().get("eventRows").first().get("marketCount").value()).toBe(2);
                done();
            }
        });
    });

    it("should keep updated when the number of markets updates for the search results page", function (done) {
        scenarioFactory.runSearchDataUpdateScenario({
            givenSearchTerm: "testSearchTerm",
            givenSearchResults: [
                mockApiResponseFactory.getSearchResult({
                    "sm": "testSearchTerm"
                })
            ],
            givenLiveRequest: {
                betGroupIds: [257, 2141, 507, 2137, 2148],
                eventIds: [1],
                eventPhase: 2,
                eventSortBy: 1,
                include: "scoreboard",
                onlyEvenLineMarkets: true
            },
            givenPrematchRequest: {
                betGroupIds: [1, 5, 65, 2, 127],
                eventIds: [1],
                eventPhase: 1,
                eventSortBy: 1,
                onlyEvenLineMarkets: false
            },
            givenWinnerListRequest: {
                betGroupIds: [562, 78],
                eventIds: [1],
                eventPhase: 1,
                eventSortBy: 1,
                onlyEvenLineMarkets: false
            },

            givenInitialPrematchBackendState: [
                mockApiResponseFactory.getEvent({
                    "mc": 1
                })
            ],
            whenPrematchBackendUpdatedTo: [
                mockApiResponseFactory.getEvent({
                    "mc": 2
                })
            ],
            thenViewmodelUpdated: function (dataSet) {
                expect(dataSet.prematchMultipleEventTables.length).not.toBe(0);
                expect(_.chain(dataSet.prematchMultipleEventTables).first().get("eventRows").first().get("marketCount").value()).toBe(2);
                done();
            }
        });
    });

});
