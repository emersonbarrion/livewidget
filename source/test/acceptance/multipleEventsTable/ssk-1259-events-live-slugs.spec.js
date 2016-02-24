describe("SSK-1259 Provide two slugs, one for live, one for prematch", function () {
    /* As a brand developer, I need a new way to tell the 
     * difference between slugs for prematch and live events in the 
     *  catalogue
     */

    beforeEach(module("sportsbook.tests"));
    var scenarioFactory;
    var mockApiResponseFactory;

    beforeEach(inject(["scenarioFactory", "mockApiResponseFactory", function (_scenarioFactory_, _mockApiResponseFactory_) {
        scenarioFactory = _scenarioFactory_;
        mockApiResponseFactory = _mockApiResponseFactory_;
    }]));

    it("should provide live slugs for live events", function () {
        scenarioFactory.runLiveOverviewInitialisationScenario({
            givenBackendState: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "bgi": 257
                        })
                    ]
                })
            ],
            thenViewmodel: function (dataSet) {

                expect(dataSet.liveMultipleEventsTables[0].categoryNode.liveSlug).toBeDefined();
                expect(dataSet.liveMultipleEventsTables[0].categoryNode.slug).toBeDefined();
                expect(dataSet.liveMultipleEventsTables[0].categoryNode.liveSlug).toMatch(/live/);

                expect(dataSet.liveMultipleEventsTables[0].eventRows[0].competitionNode.slug).toBeDefined();
                expect(dataSet.liveMultipleEventsTables[0].eventRows[0].competitionNode.liveSlug).toBeDefined();
                expect(dataSet.liveMultipleEventsTables[0].eventRows[0].competitionNode.liveSlug).toMatch(/live/);

                expect(dataSet.liveMultipleEventsTables[0].eventRows[0].slug).toMatch(/live/);
            }
        });
    });

});
