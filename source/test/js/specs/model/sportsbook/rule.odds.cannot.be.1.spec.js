describe("Model: Global Rule - Odds cannot be 1", function() {

	it("should return a violation if the odds for a selection are equal to 1", function() {
		var selection1 = { id: 10, odds: 1.0 };
        var selection2 = { id: 22, odds: 2.0 };
        var selection3 = { id: 23, odds: 1.0 };

        var selections = [selection1, selection2, selection3];

        var result1 = Sportsbook.Rules.OddsCannotEqual1Restriction.assert(selections, selection1);
        var result2 = Sportsbook.Rules.OddsCannotEqual1Restriction.assert(selections, selection2);
        var result3 = Sportsbook.Rules.OddsCannotEqual1Restriction.assert(selections, selection3);

        expect(result1.passed).toBe(false);
        expect(result1.ruleId).toBe("odds_cannot_equal_1_restriction");
        expect(result1.violations[0]).toBe(10);

		expect(result2.passed).toBe(true);

        expect(result3.passed).toBe(false);
        expect(result3.ruleId).toBe("odds_cannot_equal_1_restriction");
        expect(result3.violations[0]).toBe(23);
	});
});