describe("OSB-283 Multiview Issue", function () {

    beforeEach(module("sportsbook.tests"));

    var scenarioFactory;
    var mockApiResponseFactory;
    var initialTestMarket;

    beforeEach(inject(["scenarioFactory", "mockApiResponseFactory", "initialTestMarket", function (_scenarioFactory_, _mockApiResponseFactory_, _initialTestMarket_) {
        scenarioFactory = _scenarioFactory_;
        mockApiResponseFactory = _mockApiResponseFactory_;
        initialTestMarket = _initialTestMarket_;

    }]));

    it("should load multiview", function () {
        scenarioFactory.runMultiViewDataInitialisationScenario({
            givenCompetitionIds: [111],
            givenPrematchRequest: {
                betGroupIds: [1, 5, 65, 2, 127],
                categoryIds: [1],
                subCategoryIds: [111],
                eventPhase: 1,
                eventSortBy: 1,
                onlyEvenLineMarkets: false
            },
            givenWinnerListRequest: {
                betGroupIds: [562, 78],
                categoryIds: [1],
                subCategoryIds: [111],
                eventPhase: 1,
                eventSortBy: 1,
                onlyEvenLineMarkets: false
            },
            givenLiveRequest: {
                betGroupIds: [257, 2141, 507, 2137, 2148],
                categoryIds: [1],
                subCategoryIds: [111],
                eventPhase: 2,
                eventSortBy: 1,
                include: "scoreboard",
                onlyEvenLineMarkets: true
            },
            givenInitialPrematchBackendState: [
                mockApiResponseFactory.getEvent()
            ],
            thenViewmodel: function (dataSet) {
                expect(dataSet.prematchMultipleEventTables.length).not.toBe(0);
            }
        });
    });


});
