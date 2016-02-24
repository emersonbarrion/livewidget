describe("Provider: MarketPromotion", function () {

    beforeEach(module("sportsbook.promotions"));

    it("Should proxy calls to the service", inject(["marketPromotion", "marketPromotionService", function (marketPromotionProvider, marketPromotionService) {

        _.each(_.functions(marketPromotionProvider), function (name) {

            spyOn(marketPromotionService, name).and.returnValue(true);

            expect(marketPromotionProvider[name]()).toBe(true);
            expect(marketPromotionService[name]).toHaveBeenCalled();
        });

    }]));
});
