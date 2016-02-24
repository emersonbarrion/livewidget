describe("Service: diff", function () {

    var diff;

    beforeEach(module("sportsbook.markets"));

    beforeEach(inject(["diff", function (diffService) {
        diff = diffService;
    }]));

    it("should determine the changes in arrays of ids", function () {

        var changeSet = diff.changeset([1, 2, 3, 4], [1, 2, 4, 5]);

        expect(changeSet.added).toEqual([5]);
        expect(changeSet.removed).toEqual([3]);
        expect(changeSet.other).toEqual([1, 2, 4]);
    });

    it("should determine changes in a selection", function () {

        var selections = {
            "a": [{
                "id": 1,
                "odds": 0.5
            }, {
                "id": 1,
                "odds": 0.5
            }], // This will return null (no change)
            "b": [{
                    "id": 2,
                    "odds": 0.5
                }, {
                    "id": 2,
                    "odds": 0.6
                }] // This will return a change description
        };

        expect(diff.selections(selections.a[0], selections.a[1])).toBeNull();
        expect(diff.selections(selections.b[0], selections.b[1])).toEqual({
            "id": 2,
            "oldOdds": 0.5,
            "newOdds": 0.6,
            "oddsChange": true,
            "holdStatusChange": false
        });
    });

    it("should determine changes in a collection of selections", function () {

        var oldSelections = [{
            "id": 1,
            "name": "a",
            "odds": 0.5
        }, {
            "id": 2,
            "name": "b",
            "odds": 0.2
        }, {
            "id": 3,
            "name": "c",
            "odds": 0.4
        }];

        var newSelections = [{
            "id": 1,
            "name": "a",
            "odds": 0.7
        }, {
            "id": 2,
            "name": "b",
            "odds": 0.2
        }, {
            "id": 3,
            "name": "d",
            "odds": 0.4
        }];

        var expectedDiff = [{
            "id": 1,
            "oldOdds": 0.5,
            "newOdds": 0.7,
            "oddsChange": true,
            "holdStatusChange": false
        }, {
            "id": 3,
            "newName": "d",
            "oddsChange": false,
            "holdStatusChange": false
        }];

        expect(diff.selections(oldSelections, newSelections)).toEqual(expectedDiff);
    });

    it("should determine changes in a market", function () {

        var oldMarket = {
            "id": 1,
            "eventId": 1,
            "name": "a",
            "betGroup": {
                "name": "a"
            },
            "selections": [{
                "id": 1,
                "name": "a",
                "odds": 0.5
            }, {
                "id": 2,
                "name": "b",
                "odds": 0.2
            }]
        };

        var newMarket = {
            "id": 1,
            "eventId": 1,
            "name": "b",
            "betGroup": {
                "name": "b"
            },
            "selections": [{
                "id": 1,
                "name": "a",
                "odds": 0.5
            }, {
                "id": 2,
                "name": "b",
                "odds": 0.1
            }]
        };

        var expectedDiff = {
            "id": 1,
            "eventId": 1,
            "newName": "b",
            "newBetGroupName": "b",
            "selectionDiffsById": {
                2: {
                    "id": 2,
                    "oldOdds": 0.2,
                    "newOdds": 0.1,
                    "oddsChange": true,
                    "holdStatusChange": false
                }
            },
            "oddsChange": true,
            "holdStatusChange": false
        };

        expect(diff.markets(oldMarket, oldMarket)).toBeNull();
        expect(diff.markets(oldMarket, newMarket)).toEqual(expectedDiff);
    });

    it("should determine changes in a collection of selections", function () {
        var oldMarkets = [{
            "id": 1,
            "eventId": 1,
            "name": "a",
            "betGroup": {
                "name": "a"
            },
            "selections": [{
                "id": 1,
                "name": "a",
                "odds": 0.5
            }, {
                "id": 2,
                "name": "b",
                "odds": 0.2
            }]
        }, {
            "id": 2,
            "eventId": 1,
            "name": "a",
            "betGroup": {
                "name": "a"
            },
            "selections": [{
                "id": 1,
                "name": "c",
                "odds": 0.4
            }, {
                "id": 2,
                "name": "d",
                "odds": 0.8
            }]
        }];

        var newMarkets = [{
            "id": 1,
            "eventId": 1,
            "name": "a",
            "betGroup": {
                "name": "a"
            },
            "selections": [{
                "id": 1,
                "name": "a",
                "odds": 0.3
            }, {
                "id": 2,
                "name": "b",
                "odds": 0.1
            }]
        }, {
            "id": 2,
            "eventId": 1,
            "name": "a",
            "betGroup": {
                "name": "a"
            },
            "selections": [{
                "id": 1,
                "name": "e",
                "odds": 0.4
            }, {
                "id": 2,
                "name": "d",
                "odds": 0.8
            }]
        }];

        var expectedDiff = [{
            "id": 1,
            "eventId": 1,
            "selectionDiffsById": {
                1: {
                    "id": 1,
                    "oldOdds": 0.5,
                    "newOdds": 0.3,
                    "oddsChange": true,
                    "holdStatusChange": false
                },
                2: {
                    "id": 2,
                    "oldOdds": 0.2,
                    "newOdds": 0.1,
                    "oddsChange": true,
                    "holdStatusChange": false
                }
            },
            "oddsChange": true,
            "holdStatusChange": false
        }, {
            "id": 2,
            "eventId": 1,
            "selectionDiffsById": {
                1: {
                    "id": 1,
                    "newName": "e",
                    "oddsChange": false,
                    "holdStatusChange": false
                }
            },
            "oddsChange": false,
            "holdStatusChange": false
        }];

        expect(diff.markets(oldMarkets, newMarkets)).toEqual(expectedDiff);
    });

    it("should identify new markets in a collection of markets", function () {
        var oldCollection = [{
            "id": 1,
            "name": "a",
            "betGroup": {
                "name": "a"
            },
            "selections": [{
                "id": 1,
                "odds": 0.1
            }, {
                "id": 2,
                "odds": 0.3
            }]
        }, {
            "id": 2,
            "name": "a",
            "betGroup": {
                "name": "a"
            },
            "selections": [{
                "id": 3,
                "odds": 0.5
            }, {
                "id": 4,
                "odds": 0.3
            }]
        }];

        var newCollection = [{
            "id": 1,
            "name": "a",
            "betGroup": {
                "name": "a"
            },
            "selections": [{
                "id": 1,
                "odds": 0.1
            }, {
                "id": 2,
                "odds": 0.3
            }]
        }, {
            "id": 2,
            "name": "a",
            "betGroup": {
                "name": "a"
            },
            "selections": [{
                "id": 3,
                "odds": 0.5
            }, {
                "id": 4,
                "odds": 0.3
            }]
        }, {
            "id": 3,
            "name": "a",
            "betGroup": {
                "name": "a"
            },
            "selections": [{
                "id": 3,
                "odds": 0.5
            }, {
                "id": 4,
                "odds": 0.3
            }]
        }];

        var expectedDiff = {
            "marketDiffsById": {},
            "newMarkets": [{
                "id": 3,
                "name": "a",
                "betGroup": {
                    "name": "a"
                },
                "selections": [{
                    "id": 3,
                    "odds": 0.5
                }, {
                    "id": 4,
                    "odds": 0.3
                }]
            }],
            "deletedMarketIdsSet": {}
        };

        var expectedDiff2 = {
            "marketDiffsById": {},
            "newMarkets": [],
            "deletedMarketIdsSet": {
                3: true
            }
        };

        expect(diff.marketCollections(oldCollection, newCollection)).toEqual(expectedDiff);
        expect(diff.marketCollections(newCollection, oldCollection)).toEqual(expectedDiff2);
    });


    it("should detect changes in scoreboard statistics", function () {

        var oldStat = {
            "1": {
                "total": "1",
                "byPhase": {
                    1: "1"
                }
            },
            "2": {
                "total": "1",
                "byPhase": {
                    1: "1"
                }
            }
        };

        var newStat = {
            "1": {
                "total": "2",
                "byPhase": {
                    1: "1",
                    2: "1"
                }
            },
            "2": {
                "total": "1",
                "byPhase": {
                    1: "1"
                }
            }
        };

        var difference = diff.scoreboardStatistics(oldStat, newStat);

        expect(difference["1"].participant).toBe("1");

        expect(difference["1"].total.oldValue).toBe("1");
        expect(difference["1"].total.newValue).toBe("2");

        expect(difference["1"].byPhase[2].oldValue).toBeNull();
        expect(difference["1"].byPhase[2].newValue).toBe("1");

        expect(difference["2"]).toBeUndefined();
    });
});