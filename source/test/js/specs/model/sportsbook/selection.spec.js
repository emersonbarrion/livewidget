describe("Model: Sportsbook.Selection", function() {

    it("Constructor test", function() {

        var selection = new Sportsbook.Selection({ id: 1 }, { id: 2 }, { id: 3 });

        expect(selection.event.id).toBe(1);
        expect(selection.market.id).toBe(2);
        expect(selection.selection.id).toBe(3);
    });
});