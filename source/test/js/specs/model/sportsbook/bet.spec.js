describe("Model: Sportsbook.Bet", function () {

    it("Constructor test", function () {

        var bet = new Sportsbook.Bet(1, 0.0);

        expect(bet.stake).toBe(0.0);
        expect(bet.type).toBe(1);
    });
});