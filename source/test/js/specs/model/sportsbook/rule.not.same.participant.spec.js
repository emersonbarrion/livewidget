describe("Model: Rule 4 - Cannot combine with other selections for the same participant", function () {

    it("Should return a violation if there are other selections for the same participant", function () {

        var selection1 = { id: 10, odds: 2.0, participantId: 1 };
        var selection2 = { id: 22, odds: 2.0, participantId: 1 };
        var selection3 = { id: 23, odds: 2.0, participantId: 2 };

        var selections = [selection1, selection2, selection3];

        var result1 = Sportsbook.Rules.NotSameParticipantRestriction.assert(selections, selection1);
        var result2 = Sportsbook.Rules.NotSameParticipantRestriction.assert(selections, selection2);
        var result3 = Sportsbook.Rules.NotSameParticipantRestriction.assert(selections, selection3);

        expect(result1.passed).toBe(false);
        expect(result1.ruleId).toBe("not_same_participant_restriction");
        expect(result1.violations[0]).toBe(10);

        expect(result2.passed).toBe(false);
        expect(result2.ruleId).toBe("not_same_participant_restriction");
        expect(result2.violations[0]).toBe(22);

        expect(result3.passed).toBe(true);
    });

    it("Should pass if there are no other selections for the same participant", function () {

        var selection1 = { id: 10, odds: 2.0, participantId: 1 };
        var selection2 = { id: 22, odds: 2.0, participantId: 2 };
        var selection3 = { id: 23, odds: 2.0, participantId: 3 };

        var selections = [selection1, selection2, selection3];

        var result1 = Sportsbook.Rules.NotSameParticipantRestriction.assert(selections, selection1);
        var result2 = Sportsbook.Rules.NotSameParticipantRestriction.assert(selections, selection2);
        var result3 = Sportsbook.Rules.NotSameParticipantRestriction.assert(selections, selection3);

        expect(result1.passed).toBe(true);
        expect(result2.passed).toBe(true);
        expect(result3.passed).toBe(true);
    });
});