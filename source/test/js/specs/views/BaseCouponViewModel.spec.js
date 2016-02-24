describe("View Models: Base coupon", function () {

    var factoryName = "baseCouponViewModelFactory";
    var subject;

    beforeEach(module("sportsbook.betslip"));

    beforeEach(inject([factoryName, function (factory) {

        var maximumNumberOfSelections = 5;
        var couponType = 7;
        var initialData = [{
            "id": 1,
            "marketId": 1,
            "getParent": function () {
                return {
                    "id": 1
                }
            }
        }, {
            "id": 2,
            "marketId": 2,
            "getParent": function () {
                return {
                    "id": 2
                }
            }
        }];

        // Simulate the _updateBets function, as this is not defined by the base class.
        var Inheritor = defineDescendant(factory, function () {});

        Inheritor.prototype._updateBets = function () {
            this.bets.a = 1;
            this.bets.b = 2;
        };

        Inheritor.prototype._getTotalStake = function () {
            return 10.0;
        };

        Inheritor.prototype._getTotalEffectiveStake = function () {
            return 10.0;
        };

        Inheritor.prototype._getTotalPotentialWin = function () {
            return 20.0;
        };

        Inheritor.prototype._getTotalOdds = function () {
            return 5.20;
        };

        subject = new Inheritor(couponType, maximumNumberOfSelections, initialData);
    }]));

    it("should populate values at construction", function () {

        expect(subject.type).toBe(7);
        expect(subject.maximumNumberOfSelections).toBe(5);
        expect(subject.bets.a).toBe(1);
        expect(subject.bets.b).toBe(2);

        expect(subject.totalStake).toBe(10.0);
        expect(subject.totalPotentialWin).toBe(20.0);
    });

    it("should determine the opponent name from a selection", function () {

        var selectionWithOpponent = {
            "getParent": function () {
                return {
                    "isHeadToHead": true,
                };
            },

            "getSiblings": function () {
                return [{
                    "name": "abc"
                }];
            }
        };

        expect(subject.getOpponentName(selectionWithOpponent)).toBe("abc");

        var selectionWithoutOpponent = {
            "getParent": function () {
                return {
                    "isHeadToHead": true,
                };
            },

            "getSiblings": function () {
                return [];
            }
        };

        expect(subject.getOpponentName(selectionWithoutOpponent)).toBeNull();

        var selectionWithoutSiblings = {
            "getParent": function () {
                return {
                    "isHeadToHead": true,
                };
            },

            "getSiblings": function () {
                return null;
            }
        };

        expect(subject.getOpponentName(selectionWithoutSiblings)).toBeNull();

        var nonHeadToHead = {
            "getParent": function () {
                return {
                    "isHeadToHead": false,
                };
            }
        };

        expect(subject.getOpponentName(nonHeadToHead)).toBeNull();
    });

    it("should merge two versions of a selection", function () {

        var target = {
            "name": "old name",
            "eventName": "old event name",
            "marketName": "old market name",
            "opponentName": "old opponent name",
            "oldOdds": 0.0,
            "odds": 10.0
        }

        var source = {
            "name": "new name",
            "eventName": "new event name",
            "marketName": "new market name",
            "odds": 6.00
        }

        spyOn(subject, "getOpponentName").and.returnValue("new opponent name");

        subject.mergeSelections(target, source);

        // Properties merged directly from source
        expect(target.name).toBe(source.name);
        expect(target.eventName).toBe(source.eventName);
        expect(target.marketName).toBe(source.marketName);
        expect(target.odds).toBe(source.odds);

        // oldOdds keeps track of the previous odds on the target.
        expect(target.oldOdds).toBe(10.0);

        // opponentName is derived from a function.
        expect(target.opponentName).toBe("new opponent name");
    });

    it("should determine whether any selections are live", function () {

        subject.selections[1] = {
            "isLive": false
        };
        subject.selections[2] = {
            "isLive": false
        };
        subject.selections[3] = {
            "isLive": false
        };

        expect(subject.containsLiveSelection).toBe(false);

        subject.selections[2].isLive = true;

        expect(subject.containsLiveSelection).toBe(true);
    });

    it("should take a count of selections", function () {

        subject.selections[1] = {};
        subject.selections[2] = {};
        subject.selections[3] = {};

        expect(subject.numberOfSelections).toBe(3);

        subject.selections[4] = {};

        expect(subject.numberOfSelections).toBe(4);
    });

    it("should determine if the number of selections has reached or exceeded the maximum", function () {

        var i = 1;

        subject.selections[i++] = {};
        subject.selections[i++] = {};
        subject.selections[i++] = {};

        expect(subject.isLimitReached).toBe(false);

        // 4 - below limit
        subject.selections[i++] = {};
        expect(subject.isLimitReached).toBe(false);

        // 5 - at limit
        subject.selections[i++] = {};
        expect(subject.isLimitReached).toBe(true);

        // 6 - above limit
        subject.selections[i++] = {};
        expect(subject.isLimitReached).toBe(true);
    });

    it("should build a request object", function () {

        spyOn(subject, "_getBetsRequest").and.returnValue("x");

        var request = subject.request();

        expect(request.bonusCustomerId).toBeNull();
        expect(request.bets).toBe("x");
    });

    it("should merge and update selections", function () {

        spyOn(subject, "_updateBets");
        spyOn(subject, "update");

        var newSelections = {
            2: {
                "id": 2,
                "marketId": 2,
                "getParent": function () {
                    return {
                        "id": 2
                    }
                }
            },
            3: {
                "id": 4,
                "marketId": 3,
                "getParent": function () {
                    return {
                        "id": 3
                    }
                }
            }
        };

        subject.updateSelections(newSelections);

        expect(_.keys(subject.selections).length).toBe(2);
        expect(subject.selections[2].originalSelection.marketId).toBe(2);
        expect(subject.selections[4].originalSelection.marketId).toBe(3);

        expect(subject._updateBets).toHaveBeenCalled();
        expect(subject.update).toHaveBeenCalled();
    });

    it("should not call update bets if no selections have been added or removed.", function () {

        spyOn(subject, "_updateBets");
        spyOn(subject, "update");

        var newSelections = {
            1: {
                "id": 1,
                "marketId": 1,
                "getParent": function () {
                    return {
                        "id": 1
                    }
                }
            },
            2: {
                "id": 2,
                "marketId": 2,
                "getParent": function () {
                    return {
                        "id": 2
                    }
                }
            }
        };

        subject.updateSelections(newSelections);

        expect(subject._updateBets).not.toHaveBeenCalled();
        expect(subject.update).toHaveBeenCalled();
    });
});