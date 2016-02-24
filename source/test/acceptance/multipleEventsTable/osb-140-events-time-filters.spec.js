describe("OSB-140 Events - Time Filters", function () {

    beforeEach(module("sportsbook.tests"));

    var scenarioFactory;
    var mockApiResponseFactory;
    var initialTestMarket;

    beforeEach(inject(["scenarioFactory", "mockApiResponseFactory", "initialTestMarket", function (_scenarioFactory_, _mockApiResponseFactory_, _initialTestMarket_) {
        scenarioFactory = _scenarioFactory_;
        mockApiResponseFactory = _mockApiResponseFactory_;
        initialTestMarket = _initialTestMarket_;
    }]));

    it("should allow the data to be filtered by time up to the minute", function () {
        scenarioFactory.runLiveTablePageDataInitialisationScenario({
            givenFilters: {
                categoryIds: [1],
                eventStartFrom: new Date("2011-08-10T15:19:32Z"),
                eventStartTo: new Date("2011-08-11T15:19:32Z")
            },
            givenRequest: {
                betGroupIds: [257, 2141, 507, 2137, 2148],
                categoryIds: [1],
                eventPhase: 2,
                eventSortBy: 1,
                eventStartFrom: "2011-08-10T15:19:00",
                eventStartTo: "2011-08-11T15:19:00",
                include: "scoreboard",
                onlyEvenLineMarkets: true
            },
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
                expect(dataSet.liveMultipleEventTables.length).not.toBe(0);
            }
        });
    });


});
