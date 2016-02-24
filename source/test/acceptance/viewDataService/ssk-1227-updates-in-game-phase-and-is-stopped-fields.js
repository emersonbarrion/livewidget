describe("SSK-1227 Updates in 'Game Phase' and 'isStopped' fields",
    function () {
        /*Currently updates in the "Game Phase" and "isStopped" fields are not being triggered. This is causing events on site to keep on showing the last loaded phase.
        Example:
        Page is loaded with a Live football game in "First Half"
        Game goes into Halftime
        Site still shows that the game is in "First Half"
         */

        beforeEach(module("sportsbook.tests"));

        var scenarioFactory;
        var mockApiResponseFactory;

        beforeEach(inject(["scenarioFactory", "mockApiResponseFactory", function (_scenarioFactory_, _mockApiResponseFactory_) {
            scenarioFactory = _scenarioFactory_;
            mockApiResponseFactory = _mockApiResponseFactory_;
        }]));

        it("should stop viewmodel match clock when backend event stops", function () {

            scenarioFactory.runLiveOverviewDataUpdateScenario({
                givenInitialBackendState: [
                    mockApiResponseFactory.getEvent({
                        "cep": 2,
                        "ml": [
                            mockApiResponseFactory.getMarket({
                                "bgi": 257
                            })
                        ],
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gmc": {
                                "mcm": 2
                            }
                        })
                    })
                ],
                whenBackendUpdatedTo: [
                    mockApiResponseFactory.getEvent({
                        "cep": 2,
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gmc": {
                                "mcm": 1
                            }
                        })
                    })
                ],
                thenViewmodelUpdated: function (dataSet) {
                    expect(dataSet.liveMultipleEventsTables[0].eventRows[0].originalEvent.scoreboard.matchClock.isStopped).toBe(true);
                }
            });

        });

        it("should retain the isStopped state if it does not change", function () {

            scenarioFactory.runLiveOverviewDataUpdateScenario({
                givenInitialBackendState: [
                    mockApiResponseFactory.getEvent({
                        "cep": 2,
                        "ml": [
                            mockApiResponseFactory.getMarket({
                                "bgi": 257
                            })
                        ],
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gmc": {
                                "mcm": 1
                            }
                        })
                    })
                ],
                whenBackendUpdatedTo: [
                    mockApiResponseFactory.getEvent({
                        "cep": 2,
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gmc": {
                                "mcm": 1
                            }
                        })
                    })
                ],
                thenViewmodelUpdated: function (dataSet) {
                    expect(dataSet.liveMultipleEventsTables[0].eventRows[0].originalEvent.scoreboard.matchClock.isStopped).toBe(true);
                }
            });

        });

        it("should start viewmodel match clock when backend event starts", function () {

            scenarioFactory.runLiveOverviewDataUpdateScenario({
                givenInitialBackendState: [
                    mockApiResponseFactory.getEvent({
                        "cep": 2,
                        "ml": [
                            mockApiResponseFactory.getMarket({
                                "bgi": 257
                            })
                        ],
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gmc": {
                                "mcm": 1
                            }
                        })
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
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gmc": {
                                "mcm": 2
                            }
                        })
                    })
                ],
                thenViewmodelUpdated: function (dataSet) {
                    expect(dataSet.liveMultipleEventsTables[0].eventRows[0].originalEvent.scoreboard.matchClock.isStopped).toBe(false);
                }
            });

        });

        it("should set viewmodel match clock time to that of the backend", function () {

            scenarioFactory.runLiveOverviewDataUpdateScenario({
                givenInitialBackendState: [
                    mockApiResponseFactory.getEvent({
                        "cep": 2,
                        "ml": [
                            mockApiResponseFactory.getMarket({
                                "bgi": 257
                            })
                        ],
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gmc": {
                                "s": 2,
                                "m": 3
                            }
                        })
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
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gmc": {
                                "s": 4,
                                "m": 5
                            }
                        })
                    })
                ],
                thenViewmodelUpdated: function (dataSet) {
                    var matchClock = dataSet.liveMultipleEventsTables[0].eventRows[0].originalEvent.scoreboard.matchClock;

                    expect(matchClock.seconds).toBe(4);
                    expect(matchClock.minutes).toBe(5);
                }
            });

        });
        it("should set viewmodel phase to that of the backend", function () {

            scenarioFactory.runLiveOverviewDataUpdateScenario({
                givenInitialBackendState: [
                    mockApiResponseFactory.getEvent({
                        "cep": 2,
                        "ml": [
                            mockApiResponseFactory.getMarket({
                                "bgi": 257
                            })
                        ],
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gcp": {
                                "gpi": 2,
                                "gpn": "Old"
                            }
                        })
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
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gcp": {
                                "gpi": 3,
                                "gpn": "New"
                            }
                        })
                    })
                ],
                thenViewmodelUpdated: function (dataSet) {
                    var currentPhase = dataSet.liveMultipleEventsTables[0].eventRows[0].originalEvent.scoreboard.currentPhase;

                    expect(currentPhase.id).toBe(3);
                    expect(currentPhase.text).toBe("New");
                }
            });
        });

        it("should set viewmodel phase to that of the backend", function () {

            scenarioFactory.runLiveOverviewDataUpdateScenario({
                givenInitialBackendState: [
                    mockApiResponseFactory.getEvent({
                        "cep": 2,
                        "ml": [
                            mockApiResponseFactory.getMarket({
                                "bgi": 257
                            })
                        ],
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gcp": {
                                "gpi": 2,
                                "gpn": "Old"
                            }
                        })
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
                        "sb": mockApiResponseFactory.getScoreboard({
                            "gcp": {
                                "gpi": 3,
                                "gpn": "New"
                            }
                        })
                    })
                ],
                thenViewmodelUpdated: function (dataSet) {
                    var currentPhase = dataSet.liveMultipleEventsTables[0].eventRows[0].originalEvent.scoreboard.currentPhase;

                    expect(currentPhase.id).toBe(3);
                    expect(currentPhase.text).toBe("New");
                }
            });

        });
    });