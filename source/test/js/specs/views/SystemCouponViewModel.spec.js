describe("View Models: System coupon", function () {

    var factoryName = "systemCouponViewModelFactory";
    var subject;

    beforeEach(module("sportsbook"));
    beforeEach(module("sportsbook.betslip"));

    beforeEach(inject([factoryName, function (factory) {
        var initialData = [
            { "id": 1, "marketId": 1, "odds": 2, "getParent": function () { return { "id": 1 } } },
            { "id": 2, "marketId": 2, "odds": 5, "getParent": function () { return { "id": 2 } } }
        ];

        subject = new factory(initialData);
    }]));

    it("should populate values at construction", function () {
        expect(subject.type).toBe(2);
        expect(subject.maximumNumberOfSelections).toBe(9);
    });

    it("should generate bet requests", function () {

        subject.bets[0].stake = 5;
        subject.bets[1].stake = 6;

        var request = subject._getBetsRequest();
        expect(request.length).toBe(3);

        // Single bets (1x2)
        expect(request[0].betSelections[0].marketSelectionId).toBe(1);
        expect(request[0].betSelections[0].odds).toBe(2.0);
        expect(request[0].stake).toBe(5);

        expect(request[1].betSelections[0].marketSelectionId).toBe(2);
        expect(request[1].betSelections[0].odds).toBe(5.0);
        expect(request[1].stake).toBe(5);

        // Combi bet (2x1)
        expect(request[2].betSelections[0].marketSelectionId).toBe(1);
        expect(request[2].betSelections[0].odds).toBe(2.0);
        expect(request[2].betSelections[1].marketSelectionId).toBe(2);
        expect(request[2].betSelections[1].odds).toBe(5.0);
        expect(request[2].stake).toBe(6);
    });

    it("should set values for manual attest", function () {

        subject.stake = 5;
        subject.stakeForReview = 0;

        subject.markForManualAttest(1, 4);

        expect(subject.isForManualAttest).toBe(true);
        expect(subject.stake).toBe(1);
        expect(subject.stakeForReview).toBe(4);
    });

    it("should determine combinations based on the number of selections", function() {

        var selections = [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 }];

        var combinationsFor1 = subject._generateCombinations(selections, 1);
        expect(combinationsFor1.length).toBe(5);
        expect(combinationsFor1[0][0].id).toBe(1);
        expect(combinationsFor1[1][0].id).toBe(2);
        expect(combinationsFor1[2][0].id).toBe(3);
        expect(combinationsFor1[3][0].id).toBe(4);
        expect(combinationsFor1[4][0].id).toBe(5);

        var combinationsFor2 = subject._generateCombinations(selections, 2);
        expect(combinationsFor2.length).toBe(10);

        var combinationsFor3 = subject._generateCombinations(selections, 3);
        expect(combinationsFor3.length).toBe(10);

        var combinationsFor4 = subject._generateCombinations(selections, 4);
        expect(combinationsFor4.length).toBe(5);
        expect(combinationsFor4[0][0].id).toBe(1);
        expect(combinationsFor4[0][1].id).toBe(2);
        expect(combinationsFor4[0][2].id).toBe(3);
        expect(combinationsFor4[0][3].id).toBe(4);

        expect(combinationsFor4[1][0].id).toBe(1);
        expect(combinationsFor4[1][1].id).toBe(2);
        expect(combinationsFor4[1][2].id).toBe(3);
        expect(combinationsFor4[1][3].id).toBe(5);

        expect(combinationsFor4[2][0].id).toBe(1);
        expect(combinationsFor4[2][1].id).toBe(2);
        expect(combinationsFor4[2][2].id).toBe(4);
        expect(combinationsFor4[2][3].id).toBe(5);

        expect(combinationsFor4[3][0].id).toBe(1);
        expect(combinationsFor4[3][1].id).toBe(3);
        expect(combinationsFor4[3][2].id).toBe(4);
        expect(combinationsFor4[3][3].id).toBe(5);

        expect(combinationsFor4[4][0].id).toBe(2);
        expect(combinationsFor4[4][1].id).toBe(3);
        expect(combinationsFor4[4][2].id).toBe(4);
        expect(combinationsFor4[4][3].id).toBe(5);

        var combinationsFor5 = subject._generateCombinations(selections, 5);
        expect(combinationsFor5.length).toBe(1);
        expect(combinationsFor5[0][0].id).toBe(1);
        expect(combinationsFor5[0][1].id).toBe(2);
        expect(combinationsFor5[0][2].id).toBe(3);
        expect(combinationsFor5[0][3].id).toBe(4);
        expect(combinationsFor5[0][4].id).toBe(5);
    });

    it("should use global stake if set", function() {

        subject.bets[0].stake = 1;
        subject.bets[1].stake = 2;

        subject.stake = 8;
        subject.update();

        expect(subject.bets[0].stake).toBe(1); // Single bets are not affected
        expect(subject.bets[0].stakeEnabled).toBe(true);

        expect(subject.bets[1].stake).toBe(8);
        expect(subject.bets[1].stakeEnabled).toBe(false);
    });

    it("should update bets if selections are removed", function() {

        var selections = {
            4: { "id": 1, "marketId": 4, "getParent": function () { return { "id": 4 } } },
            2: { "id": 2, "marketId": 2, "getParent": function () { return { "id": 2 } } },
            3: { "id": 3, "marketId": 3, "getParent": function () { return { "id": 3 } } }
        };

        // With three selections, we should have three sets of bets (3 singles, 3 doubles, one triple)
        subject.updateSelections(selections);
        expect(_.keys(subject.bets).length).toBe(3);

        var newSelections = {
            4: { "id": 1, "marketId": 4, "getParent": function () { return { "id": 4 } } },
            2: { "id": 2, "marketId": 2, "getParent": function () { return { "id": 2 } } },
        };

        // With two selections, we should have two sets of bets (2 singles, one double)
        subject.updateSelections(newSelections);
        expect(_.keys(subject.bets).length).toBe(2);
    });

    it("should calculate the total odds", function () {
        expect(subject._getTotalOdds()).toBe(17);
    });
});