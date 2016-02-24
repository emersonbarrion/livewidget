describe("View Models: Combi coupon", function () {

    var factoryName = "combiCouponViewModelFactory";
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
        expect(subject.type).toBe(1);
        expect(subject.maximumNumberOfSelections).toBe(20);
    });

    it("should generate bet requests", function() {

        subject.stake = 5;

        var request = subject._getBetsRequest();
        expect(request.length).toBe(1);

        expect(request[0].stake).toBe(5);
        expect(request[0].stakeForReview).toBe(0);

        expect(request[0].betSelections[0].marketSelectionId).toBe(1);
        expect(request[0].betSelections[0].odds).toBe(2.0);
        expect(request[0].betSelections[1].marketSelectionId).toBe(2);
        expect(request[0].betSelections[1].odds).toBe(5.0);
    });

    it("should set values for manual attest", function () {

        subject.stake = 5;
        subject.stakeForReview = 0;

        subject.markForManualAttest(1, 4);

        expect(subject.isForManualAttest).toBe(true);
        expect(subject.stake).toBe(1);
        expect(subject.stakeForReview).toBe(4);
    });

    it("should calculate the total odds", function () {
        expect(subject._getTotalOdds()).toBe(10);
    });
});