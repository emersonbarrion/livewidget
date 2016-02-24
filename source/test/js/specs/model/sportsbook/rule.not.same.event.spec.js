describe("Model: Rule 1 - Cannot combine with other selections from the same event", function () {



    it("Should return a violation if there are other selections from the same event", function () {

        var testSelection1 = { id: 1, name: "Selection 1", eventId: 1, marketId: 1, ruleId: 1, odds: 2.0 };
        var testSelection2 = { id: 2, name: "Selection 2", eventId: 1, marketId: 2, ruleId: 1, odds: 3.0 };
        var testSelection3 = { id: 3, name: "Selection 3", eventId: 2, marketId: 3, ruleId: 1, odds: 4.0 };

        var testSelections = [testSelection1, testSelection2, testSelection3];
        
        var result1 = Sportsbook.Rules.NotSameEventRestriction.assert(testSelections, testSelections[0]);
        var result2 = Sportsbook.Rules.NotSameEventRestriction.assert(testSelections, testSelections[1]);
        var result3 = Sportsbook.Rules.NotSameEventRestriction.assert(testSelections, testSelections[2]);

        expect(result1.passed).toBe(false);
        expect(result1.ruleId).toBe("not_same_event_restriction");
        expect(result1.violations.length).toBe(1);
        expect(result1.affected.length).toBe(1);

        expect(result2.passed).toBe(false);
        expect(result2.ruleId).toBe("not_same_event_restriction");
        expect(result2.violations.length).toBe(1);
        expect(result2.affected.length).toBe(1);

        expect(result3.passed).toBe(true);
    });

    it("Should pass if there are no other selections from the same event", function () {
        var testSelection1 = { id: 1, name: "Selection 1", marketId: 1, eventId: 1, odds: 2.0 };
        var testSelection2 = { id: 2, name: "Selection 2", marketId: 2, eventId: 2, odds: 3.0 };
        var testSelection3 = { id: 3, name: "Selection 3", marketId: 3, eventId: 3, odds: 4.0 };

        var testSelections = [testSelection1, testSelection2, testSelection3];

        var result1 = Sportsbook.Rules.NotSameEventRestriction.assert(testSelections, testSelections[0]);
        var result2 = Sportsbook.Rules.NotSameEventRestriction.assert(testSelections, testSelections[1]);
        var result3 = Sportsbook.Rules.NotSameEventRestriction.assert(testSelections, testSelections[2]);

        expect(result1.passed).toBe(true);
        expect(result2.passed).toBe(true);
        expect(result3.passed).toBe(true);
    });
});