describe("View Models: Single coupon", function () {

    var factoryName = "singleCouponViewModelFactory";
    var subject;

    beforeEach(module("sportsbook"));    
    beforeEach(module("sportsbook.betslip"));    

    beforeEach(inject([factoryName, function (factory) {
        var initialData = [
            { "id": 1, "odds": 2.0, "marketId": 1, "getParent": function () { return { "id": 1 } } },
            { "id": 2, "odds": 5.0, "marketId": 2, "getParent": function () { return { "id": 2 } } }
        ];

        subject = new factory(initialData);
    }]));

    it("should populate values at construction", function () {
        expect(subject.type).toBe(0);
        expect(subject.maximumNumberOfSelections).toBe(0);
    });

    it("should set the stake when overriding for manual attest", function() {

        subject.markForManualAttest(10, 5);
        expect(subject.bets[1].stake).toBe(10);
        expect(subject.bets[1].stakeForReview).toBe(5);
        expect(subject.isForManualAttest).toBe(true);
    });

    it("should not throw an exception if no bet is present when overriding for manual attest", function() {

        delete subject.bets[1];
        delete subject.bets[2];

        var betKeys = _.chain(subject.bets).keys();
        expect(betKeys.value().length).toBe(0);
        subject.markForManualAttest(10, 5);
        expect(betKeys.value().length).toBe(0);
    });

    it("should generate bet requests", function() {

        subject.bets[1].stake = 5;
        subject.bets[2].stake = 7;

        var request = subject._getBetsRequest();
        expect(request.length).toBe(2);
        
        expect(request[0].stake).toBe(5);
        expect(request[0].stakeForReview).toBe(0);
        expect(request[0].betSelections[0].marketSelectionId).toBe("1");
        expect(request[0].betSelections[0].odds).toBe(2.0);

        expect(request[1].stake).toBe(7);
        expect(request[1].stakeForReview).toBe(0);
        expect(request[1].betSelections[0].marketSelectionId).toBe("2");
        expect(request[1].betSelections[0].odds).toBe(5.0);
    });

    it("should update bets", function () {

        expect(subject.bets[1].selectionId).toBe("1");
        expect(subject.bets[2].selectionId).toBe("2");

        var newSelections = {
            2: {
                "id": 2,
                "marketId": 2,
                "getParent": function () { return { "id": 2 } }
            },
            3: {
                "id": 4,
                "marketId": 3,
                "getParent": function () { return { "id": 3 } }
            }
        };

        subject.updateSelections(newSelections);

        expect(subject.bets[4].selectionId).toBe("4");
        expect(subject.bets[2].selectionId).toBe("2");
        expect(subject.bets[1]).not.toBeDefined();
    });

    it("should calculate the total odds", function () {
        expect(subject._getTotalOdds()).toBe(7);
    });
});