describe("Model: Rule 3 - Market cannot be combined with any other market", function() {

    it("Should pass if there are no other selections", function () {

        var event1 = { id: 1 };
        var market1 = { id: 1, eventId: 1, betGroup: { id: 1 }, ruleId: 3, getParent: function () { return event1; } };
        var testSelection1 = { id: 1, name: "Selection 1", marketId: 1, odds: 2.0, getParent: function() { return market1; } };

        event1.getMarkets = function () { return [market1]; };

        var result1 = Sportsbook.Rules.CannotCombineRestriction.assert([], testSelection1);

        expect(result1.passed).toBe(true);
    });

    it("Should return a violation if there are other selections", function () {

        var event1 = { id: 1 };
        var event2 = { id: 2 };

        var market1 = { id: 1, eventId: 1, betGroup: { id: 1 }, ruleId: 3, getParent: function () { return event1; } };
        var market2 = { id: 2, eventId: 2, betGroup: { id: 2 }, ruleId: 3, getParent: function () { return event2; } };

        event1.getMarkets = function () { return [market1]; };
        event2.getMarkets = function () { return [market2]; };

        var testSelection1 = { id: 1, name: "Selection 1", marketId: 1, odds: 2.0, getParent: function() { return market1; } };
        var testSelection2 = { id: 2, name: "Selection 2", marketId: 2, odds: 3.0, getParent: function () { return market2; } };

        var result1 = Sportsbook.Rules.CannotCombineRestriction.assert([testSelection1, testSelection2], testSelection1);

        expect(result1.passed).toBe(false);
        expect(result1.ruleId).toBe("cannot_combine");
        expect(result1.violations[0]).toBe(1);
    });
});