describe("SSK-1259 Provide two slugs, one for live, one for prematch", function () {
    /* As a brand developer, I need a new way to tell the 
     * difference between slugs for prematch and live events in the 
     *  catalogue
     */


    beforeEach(module("sportsbook.tests"));

    var catalogue,
        testUrlBuilder,
        initialTestMarket,
        $httpBackend,
        testCategories,
        mockApiResponseFactory;

    beforeEach(inject(["$httpBackend", "testUrlBuilder", "initialTestMarket", "mockApiResponseFactory", "catalogue", "sportsbookConfiguration", function (_$httpBackend_, _testUrlBuilder_, _initialTestMarket_, _mockApiResponseFactory_, _catalogue_, _sportsbookConfiguration_) {
        catalogue = _catalogue_;
        testUrlBuilder = _testUrlBuilder_;
        initialTestMarket = _initialTestMarket_;
        $httpBackend = _$httpBackend_;
        mockApiResponseFactory = _mockApiResponseFactory_;
        sportsbookConfiguration = _sportsbookConfiguration_;
    }]));


    it("should provide prematch and live slugs", function (done) {

        $httpBackend.whenGET(testUrlBuilder.getSportsbookCategoryApiUrl(
            initialTestMarket.id,
            initialTestMarket.languageCode, {
                eventPhase: 0,
                ocb: sportsbookConfiguration.clientInterfaceIdentifier
            })).respond([
            mockApiResponseFactory.getCategory({
                "cn": "Category",
                "rl": [
                    mockApiResponseFactory.getRegion({
                        "rn": "Region",
                        "scl": [
                            mockApiResponseFactory.getSubCategory({
                                "scn": "Competition"
                            })
                        ]
                    })
                ]
            })
        ]);

        catalogue.getMenu().then(function (menu) {
            var category = menu[0];
            var region = category.children[0];
            var subCategory = region.children[0];

            expect(category.slug).toBe(["", initialTestMarket.urlMarketCode, "category"].join("/"));
            expect(category.liveSlug).toBe(["", initialTestMarket.urlMarketCode, "live/category"].join("/"));

            expect(region.slug).toBe(["", initialTestMarket.urlMarketCode, "category/region"].join("/"));
            expect(region.liveSlug).toBe(["", initialTestMarket.urlMarketCode, "live/category/region"].join("/"));

            expect(subCategory.slug).toBe(["", initialTestMarket.urlMarketCode, "category/region/competition"].join("/"));
            expect(subCategory.liveSlug).toBe(["", initialTestMarket.urlMarketCode, "live/category/region/competition"].join("/"));

            done();
        });

        $httpBackend.flush();
    });
});
