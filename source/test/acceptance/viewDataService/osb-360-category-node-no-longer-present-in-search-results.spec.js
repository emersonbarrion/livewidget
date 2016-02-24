describe("OSB-360 Category node no longer present in search results", function () {
    beforeEach(module("sportsbook.tests"));

    var scenarioFactory;
    var mockApiResponseFactory;

    beforeEach(inject(["scenarioFactory", "mockApiResponseFactory", function (_scenarioFactory_, _mockApiResponseFactory_) {
        scenarioFactory = _scenarioFactory_;
        mockApiResponseFactory = _mockApiResponseFactory_;
    }]));

    it("should include the category node in the event rows", function () {
        scenarioFactory.runSearchDataInitialisationScenario({
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
            thenViewmodel: function (dataSet) {
                expect(dataSet.prematchMultipleEventTables[0].categoryNode).toBeDefined();
            }
        });
    });

});
