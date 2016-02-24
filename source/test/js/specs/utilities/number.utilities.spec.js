describe("Utility: Number", function () {
    describe("roundAtMidpoint", function () {

        it("should round to the nearest even at midpoint.", function () {
            expect((3.5).roundAtMidpoint()).toBe(4);
            expect((2.8).roundAtMidpoint()).toBe(3);
            expect((2.5).roundAtMidpoint()).toBe(2);
            expect((2.1).roundAtMidpoint()).toBe(2);
            expect((-2.1).roundAtMidpoint()).toBe(-2);
            expect((-2.5).roundAtMidpoint()).toBe(-2);
            expect((-2.8).roundAtMidpoint()).toBe(-3);
            expect((-3.5).roundAtMidpoint()).toBe(-4);
            expect((1.535).roundAtMidpoint(2)).toBe(1.54);
            expect((1.525).roundAtMidpoint(2)).toBe(1.52);
        });

    });
});