describe("SSK-1277 Scoreboards Adapter \"toAction\" bug", function () {
    beforeEach(module("sportsbook.tests"));
    var scenarioFactory;
    var mockApiResponseFactory;

    beforeEach(inject(["scenarioFactory", "mockApiResponseFactory", function (_scenarioFactory_, _mockApiResponseFactory_) {
        scenarioFactory = _scenarioFactory_;
        mockApiResponseFactory = _mockApiResponseFactory_;
    }]));

    it("should include the actions in the multiple events table viewmodel", function () {
        scenarioFactory.runLiveOverviewInitialisationScenario({
            givenBackendState: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "sb": mockApiResponseFactory.getScoreboard({
                        "gal": [{
                            "ati": 301,
                            "an": "Kim scores in Bottom of #period#",
                            "api": 15587,
                            "dt": "2015-08-24T07:31:31.89Z"
                        }, {
                            "ati": 301,
                            "an": "Kim scores in Bottom of #period#",
                            "api": 15587,
                            "dt": "2015-08-24T07:31:31.88Z"
                        }]
                    }),
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "bgi": 257
                        })
                    ]
                })
            ],
            thenViewmodel: function (dataSet) {

                expect(dataSet.liveMultipleEventsTables[0].eventRows[0].originalEvent.scoreboard.actions).toEqual([{
                    type: 301,
                    name: "Kim scores in Bottom of #period#",
                    participantId: 15587,
                    date: new Date("2015-08-24T07:31:31.89Z")
                }, {
                    type: 301,
                    name: "Kim scores in Bottom of #period#",
                    participantId: 15587,
                    date: new Date("2015-08-24T07:31:31.88Z")
                }]);
            }
        });
    });

});
