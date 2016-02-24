describe("DataSource Factory: Variable Selection List", function () {
    var eventsResource, eventDataSourceManager, factory, $rootScope, $q, _;

    var mockDataSourceManager = {
        isLoading: function () {

        }
    };

    var objectFromStorage = {
        "1": {
            "markets": {
                "1": {
                    "selections": {
                        "1": true
                    },
                    "betGroupId": 1
                },
                "2": {
                    "selections": {
                        "3": true
                    },
                    "betGroupId": 2
                }
            }
        },
        "2": {
            "markets": {
                "3": {
                    "selections": {
                        "6": true
                    },
                    "betGroupId": 3
                }
            }
        }
    };

    function getTestData() {

        var events = [{
            id: 1,
            name: "Test event 1"
        }, {
            id: 2,
            name: "Test event 2"
        }];


        var markets = [{
            id: 1,
            name: "Test market 1",
            betGroup: {
                id: 1
            },
            getParent: function () {
                return events[0];
            },
            eventId: events[0].id
        }, {
            id: 2,
            name: "Test market 2",
            betGroup: {
                id: 2
            },
            getParent: function () {
                return events[0];
            },
            eventId: events[0].id
        }, {
            id: 3,
            name: "Test market 3",
            betGroup: {
                id: 3
            },
            getParent: function () {
                return events[1];
            },
            eventId: events[1].id
        }];

        events[0].markets = [markets[0], markets[1]];
        events[1].markets = [markets[2]];

        var selections = [{
            id: 1,
            name: "Test selection 1",
            getParent: function () {
                return markets[0];
            },
            eventId: markets[0].eventId,
            betGroupId: markets[0].betGroup.id,
            marketId: markets[0].id
        }, {
            id: 2,
            name: "Test selection 2",
            getParent: function () {
                return markets[1];
            },
            eventId: markets[1].eventId,
            betGroupId: markets[1].betGroup.id,
            marketId: markets[1].id
        }, {
            id: 3,
            name: "Test selection 3",
            getParent: function () {
                return markets[1];
            },
            eventId: markets[1].eventId,
            betGroupId: markets[1].betGroup.id,
            marketId: markets[1].id
        }, {
            id: 4,
            name: "Test selection 4",
            getParent: function () {
                return markets[2];
            },
            eventId: markets[2].eventId,
            betGroupId: markets[2].betGroup.id,
            marketId: markets[2].id
        }, {
            id: 5,
            name: "Test selection 5",
            getParent: function () {
                return markets[2];
            },
            eventId: markets[2].eventId,
            betGroupId: markets[2].betGroup.id,
            marketId: markets[2].id
        }, {
            id: 6,
            name: "Test selection 6",
            getParent: function () {
                return markets[2];
            },
            eventId: markets[2].eventId,
            betGroupId: markets[2].betGroup.id,
            marketId: markets[2].id
        }];

        markets[0].selections = [selections[0]];
        markets[1].selections = [selections[1], selections[2]];
        markets[2].selections = [selections[3], selections[4], selections[5]];

        return {
            events: events,
            markets: markets,
            selections: selections
        };
    }

    beforeEach(module("sportsbook.markets"));

    beforeEach(inject(["$q", "$rootScope", "variableSelectionListDataSourceFactory", "eventDataSourceManager", "applicationState", "eventsResource", "lodash", "prematchSession", function (_$q_, _$rootScope_, variableSelectionListDataSourceFactory, _eventDataSourceManager_, applicationState, _eventsResource_, lodash, prematchSession) {
        $q = _$q_;
        $rootScope = _$rootScope_;

        eventsResource = _eventsResource_;
        eventDataSourceManager = _eventDataSourceManager_;

        factory = variableSelectionListDataSourceFactory;
        _ = lodash;

        spyOn(applicationState, "culture").and.returnValue($q.when({
            languageCode: "en"
        }));
        spyOn(applicationState, "user").and.returnValue($q.when({
            "isAuthenticated": false,

        }));
        spyOn(prematchSession, "getSessionInfo").and.returnValue($q.when({
            "segmentId": 601,
            "token": "TEST_TOKEN"
        }));
    }]));

    it("should provide a concise non-cyclical serialization to JSON", function () {
        spyOn(mockDataSourceManager, "isLoading").and.returnValue(false);

        var dataSource = new factory("", mockDataSourceManager);
        _.forEach(getTestData().selections, function (selection) {
            dataSource.addSelection(selection);
        });

        $rootScope.$digest();

        expect(JSON.stringify(dataSource)).toEqual(JSON.stringify({
            "1": {
                "markets": {
                    "1": {
                        "selections": {
                            "1": true
                        },
                        "betGroupId": 1,
                        "betslipOrder": 1
                    },
                    "2": {
                        "selections": {
                            "3": true
                        },
                        "betGroupId": 2,
                        "betslipOrder": 3
                    }
                }
            },
            "2": {
                "markets": {
                    "3": {
                        "selections": {
                            "6": true
                        },
                        "betGroupId": 3,
                        "betslipOrder": 4
                    }
                }
            }
        }));
    });

    it("should remove selections from markets which have been deleted.", function () {
        var dataSource = new factory("", mockDataSourceManager);
        var testSelections = getTestData().selections;

        dataSource.addSelection(testSelections[0]);
        dataSource.addSelection(testSelections[3]);
        dataSource.addSelection(testSelections[4]);

        $rootScope.$digest();

        var market = testSelections[3].getParent();

        dataSource.processDeletedMarkets([market]);

        expect(dataSource.content).toEqual({
            1: testSelections[0]
        });
    });

    it("should allow the addition of selections from the datasource manager.", function () {
        var dataSource = new factory("", mockDataSourceManager);
        var testSelections = getTestData().selections;

        dataSource.addSelection(testSelections[0]);

        $rootScope.$digest();

        expect(dataSource.content).toEqual({
            1: testSelections[0]
        });
    });


    it("should allow the removal of selections.", function () {
        var dataSource = new factory("", mockDataSourceManager);
        var testSelections = getTestData().selections;

        dataSource.addSelection(testSelections[0]);
        dataSource.addSelection(testSelections[1]);
        dataSource.removeSelection(testSelections[1]);

        $rootScope.$digest();

        expect(dataSource.content).toEqual({
            1: testSelections[0]
        });
    });

    it("should load the events from the server when prompted.", function () {
        spyOn(eventsResource, "query").and.returnValue(
            $q.when({
                data: "serverData"
            }));

        var dataSource = new factory("", mockDataSourceManager);
        var testSelections = getTestData().selections;

        dataSource.addSelection(testSelections[0]);
        dataSource.addSelection(testSelections[4]);

        $rootScope.$digest();

        dataSource.eventsSource().then(function (data) {
            expect(data.data).toBe("serverData");
        });

        $rootScope.$digest();

        expect(eventsResource.query).toHaveBeenCalledWith({
            eventIds: '1,2',
            betGroupIds: '1,3',
            include: 'scoreboard'
        }, {
            languageCode: 'en'
        }, true);
    });

    it("should be able to rebuild itself from the deserialized JSON object on first call.", function (done) {
        var testData = getTestData();

        spyOn(eventsResource, "query").and.returnValue($q.when(testData.events));

        eventDataSourceManager.createVariableSelectionListDataSource("test", objectFromStorage).then(function (dataSource) {

            expect(dataSource.content).toEqual({
                1: jasmine.objectContaining({
                    id: 1
                }),
                2: jasmine.objectContaining({
                    id: 3
                }),
                3: jasmine.objectContaining({
                    id: 6
                }),
            });

            done();
        });

        $rootScope.$digest();
    });
});
