describe("SSK-1269 Navigating to UCL women's qualifying page throws 404", function () {

    beforeEach(module("sportsbook.tests"));

    var scenarioFactory;
    var mockApiResponseFactory;
    var initialTestMarket;

    beforeEach(inject(["scenarioFactory", "mockApiResponseFactory", "initialTestMarket", function (_scenarioFactory_, _mockApiResponseFactory_, _initialTestMarket_) {
        scenarioFactory = _scenarioFactory_;
        mockApiResponseFactory = _mockApiResponseFactory_;
        initialTestMarket = _initialTestMarket_;
    }]));

    it("should provide a valid slug for events", function () {
        scenarioFactory.runLiveOverviewInitialisationScenario({
            givenBackendState: [
                mockApiResponseFactory.getEvent({
                    "en": "♥",
                    "cep": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "bgi": 257
                        })
                    ]
                })
            ],
            thenViewmodel: function (dataSet) {
                expect(dataSet.liveMultipleEventsTables[0].eventRows[0].slug).toBe([
                    "",
                    initialTestMarket.urlMarketCode,
                    "live/test-category/test-region/test-sub-category/love"
                ].join("/"));
            }
        });
    });

});
