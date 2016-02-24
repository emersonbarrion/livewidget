describe("Model: Rule 0 - No restriction", function () {

    it("Should not return any violations", function () {
        var testSelection1 = { id: 1, eventId: 1, name: "Selection 1", ruleId: 0, marketId: 1, odds: 2.0 };
        var testSelection2 = { id: 2, eventId: 1, name: "Selection 2", ruleId: 0, marketId: 2, odds: 3.0 };

        var testSelections = [testSelection1, testSelection2];
        var result = Sportsbook.Rules.NoRestriction.assert(testSelections, testSelection1);

        expect(result.passed).toBe(true);

        result = Sportsbook.Rules.NoRestriction.assert(testSelections, testSelection1);

        expect(result.passed).toBe(true);
    });
});