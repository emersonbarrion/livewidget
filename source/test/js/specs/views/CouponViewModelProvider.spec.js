describe("View Models: coupon view model provider", function() {

    beforeEach(module("sportsbook.betslip"));

    var providerName = "couponViewModel";
    var dependencies = {};
    var types;
    var subject;

    beforeEach(inject([
        providerName, "singleCouponViewModelFactory", "combiCouponViewModelFactory", "systemCouponViewModelFactory", "couponTypes", function (provider, singles, combi, system, couponTypes) {
            subject = provider;
            types = couponTypes;

            dependencies.singleBetViewModel = singles;
            dependencies.combiBetViewModel = combi;
            dependencies.systemBetViewModel = system;            
        }
    ]));

    it("should return factories by type", function() {

        var singlesFactory = subject.byType(types.single);
        var singles = singlesFactory.create([]);

        expect(singles.type).toBe(types.single);

        var combiFactory = subject.byType(types.combi);
        var combi = combiFactory.create([]);

        expect(combi.type).toBe(types.combi);

        var systemFactory = subject.byType(types.system);
        var system = systemFactory.create([]);

        expect(system.type).toBe(types.system);
    });

    it("should throw if an unknown type is given", function() {
        try {
            var x = subject.byType(666);
            expect(x).not.toBeDefined();
        } catch (e) {
            expect(e).toBe("Unkown coupon type: 666");
        }
    });
});