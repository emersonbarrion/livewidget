describe("SSK-1216 Live lobby service in view data service", function () {
    /* As a brand developer, I need a new method on the view data service
     * which gives me the viewmodel for the live overview page. Here's a
     * design for what it should look like:
     * https://projects.invisionapp.com/share/YJ41IQOEZ#/screens/98808541
     */

    beforeEach(module("sportsbook.tests"));
    var scenarioFactory;
    var mockApiResponseFactory;

    beforeEach(inject(["scenarioFactory", "mockApiResponseFactory", function (_scenarioFactory_, _mockApiResponseFactory_) {
        scenarioFactory = _scenarioFactory_;
        mockApiResponseFactory = _mockApiResponseFactory_;
    }]));

    it("should retrieve overview data", function () {
        scenarioFactory.runLiveOverviewInitialisationScenario({
            givenBackendState: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "bgi": 257,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msp": 2.0
                                })
                            ]
                        })
                    ]
                })
            ],
            thenViewmodel: function (dataSet) {
                expect(dataSet).toBeDefined();
                expect(dataSet.liveMultipleEventsTables).toBeDefined();
                expect(dataSet.liveMultipleEventsTables.length).toBe(1);
                expect(dataSet.liveMultipleEventsTables[0].categoryNode.id).toBe(1);
            }
        });
    });

    it("should update overview data", function () {
        scenarioFactory.runLiveOverviewDataUpdateScenario({
            givenInitialBackendState: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "bgi": 257,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msp": 2.0
                                })
                            ]
                        })
                    ]
                })
            ],
            whenBackendUpdatedTo: [
                mockApiResponseFactory.getEvent({
                    "cep": 2,
                    "ml": [
                        mockApiResponseFactory.getMarket({
                            "bgi": 257,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "msp": 5.0
                                })
                            ]
                        })
                    ]
                })
            ],
            thenViewmodelUpdated: function (dataSet) {
                expect(dataSet.liveMultipleEventsTables[0].eventRows[0].marketCells[0].selections[0].odds).toBe(5.0);
            }
        });
    });

});