describe("OSB-142 SSK: Events - Starting Soon - Long list", function () {
    beforeEach(module("sportsbook.tests"));

    var scenarioFactory;
    var mockApiResponseFactory;

    beforeEach(inject(["scenarioFactory", "mockApiResponseFactory", function (_scenarioFactory_, _mockApiResponseFactory_) {
        scenarioFactory = _scenarioFactory_;
        mockApiResponseFactory = _mockApiResponseFactory_;
    }]));

    it("should return empty page data for invalid searches", function () {
        scenarioFactory.runSearchDataInitialisationScenario({
            givenSearchTerm: "nothing",
            givenSearchResults: [],
            thenViewmodel: function (dataSet) {
                expect(dataSet.prematchWinnerLists).toBeDefined();
                expect(dataSet.liveMultipleEventTables).toBeDefined();
                expect(dataSet.prematchMultipleEventTables).toBeDefined();

                expect(dataSet.registerDataSourceListeners).toBeDefined();
            }
        });
    });

});
