
describe("SSK-1253 Live Scoreboard not updating when initially set to null", function () {

    beforeEach(module("sportsbook.tests"));

    var scenarioFactory,
        mockApiResponseFactory;

    beforeEach(function () {

        inject(["scenarioFactory", "mockApiResponseFactory",
            function (_scenarioFactory_, _mockApiResponseFactory_) {
                scenarioFactory = _scenarioFactory_;
                mockApiResponseFactory = _mockApiResponseFactory_;
            }
        ]);
    });

    it("should show the scoreboard once it is added", function () {
        scenarioFactory.runLiveOverviewDataUpdateScenario({
            givenInitialBackendState: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "bgi": 257
                        })
                    ],
                    "sb": null
                })
            ],
            whenBackendUpdatedTo: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "bgi": 257
                        })
                    ],
                    "sb": mockApiResponseFactory.getScoreboard()
                })
            ],
            thenViewmodelUpdated: function (dataSet) {
                expect(_.chain(dataSet.liveMultipleEventsTables).first().get("eventRows").first().get("originalEvent").value().scoreboard).toBeTruthy();
            }
        });
    });

    it("should remove the scoreboard once it is removed", function () {
        scenarioFactory.runLiveOverviewDataUpdateScenario({
            givenInitialBackendState: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "bgi": 257
                        })
                    ],
                    "sb": mockApiResponseFactory.getScoreboard()
                })
            ],
            whenBackendUpdatedTo: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "bgi": 257
                        })
                    ],
                    "sb": null
                })
            ],
            thenViewmodelUpdated: function (dataSet) {
                expect(_.chain(dataSet.liveMultipleEventsTables).first().get("eventRows").first().get("originalEvent").value().scoreboard).toBeNull();
            }
        });
    });
});