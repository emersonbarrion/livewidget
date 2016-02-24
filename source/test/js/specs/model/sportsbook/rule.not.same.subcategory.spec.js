describe("Model: Rule 2 - Cannot combine with other selections for the same sub category", function () {

    it("Should return a violation if there are other selections for the same  sub category", function () {
        var testSelection1 = { id: 1, name: "Selection 1", marketId: 1, ruleId: 2, subCategoryId: 1, odds: 2.0 };
        var testSelection2 = { id: 2, name: "Selection 2", marketId: 2, ruleId: 2, subCategoryId: 1, odds: 3.0 };
        var testSelection3 = { id: 3, name: "Selection 3", marketId: 3, ruleId: 2, subCategoryId: 2, odds: 4.0 };

        var testSelections = [testSelection1, testSelection2, testSelection3];

        var result1 = Sportsbook.Rules.NotSameSubCategoryRestriction.assert(testSelections, testSelection1);
        var result2 = Sportsbook.Rules.NotSameSubCategoryRestriction.assert(testSelections, testSelection2);
        var result3 = Sportsbook.Rules.NotSameSubCategoryRestriction.assert(testSelections, testSelection3);

        expect(result1.passed).toBe(false);
        expect(result1.ruleId).toBe("not_same_subcategory_restriction");
        expect(result1.violations[0]).toBe(1);

        expect(result2.passed).toBe(false);
        expect(result2.ruleId).toBe("not_same_subcategory_restriction");
        expect(result2.violations[0]).toBe(2);

        expect(result3.passed).toBe(true);
    });

    it("Should pass if there are no other selections for the same  sub category", function () {
        var testSelection1 = { id: 1, name: "Selection 1", marketId: 1, ruleId: 2, subCategoryId: 1, odds: 2.0 };
        var testSelection2 = { id: 2, name: "Selection 2", marketId: 2, ruleId: 2, subCategoryId: 2, odds: 3.0 };
        var testSelection3 = { id: 3, name: "Selection 3", marketId: 3, ruleId: 2, subCategoryId: 3, odds: 4.0 };

        var testSelections = [testSelection1, testSelection2, testSelection3];

        var result1 = Sportsbook.Rules.NotSameSubCategoryRestriction.assert(testSelections, testSelection1);
        var result2 = Sportsbook.Rules.NotSameSubCategoryRestriction.assert(testSelections, testSelection2);
        var result3 = Sportsbook.Rules.NotSameSubCategoryRestriction.assert(testSelections, testSelection3);

        expect(result1.passed).toBe(true);
        expect(result2.passed).toBe(true);
        expect(result3.passed).toBe(true);
    });
});