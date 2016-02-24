describe("SSK-1269 Navigating to UCL women's qualifying page throws 404", function () {

    beforeEach(module("sportsbook.tests"));

    var catalogue,
        testUrlBuilder,
        initialTestMarket,
        $httpBackend,
        mockApiResponseFactory;

    beforeEach(inject(["$httpBackend", "testUrlBuilder", "initialTestMarket", "mockApiResponseFactory", "catalogue", "sportsbookConfiguration", function (_$httpBackend_, _testUrlBuilder_, _initialTestMarket_, _mockApiResponseFactory_, _catalogue_, _sportsbookConfiguration_) {
        catalogue = _catalogue_;
        testUrlBuilder = _testUrlBuilder_;
        initialTestMarket = _initialTestMarket_;
        $httpBackend = _$httpBackend_;
        mockApiResponseFactory = _mockApiResponseFactory_;
        sportsbookConfiguration = _sportsbookConfiguration_;
    }]));

    it("should provide a valid slug for each node", function (done) {
        $httpBackend.whenGET(testUrlBuilder.getSportsbookCategoryApiUrl(
            initialTestMarket.id,
            initialTestMarket.languageCode, {
                eventPhase: 0,
                ocb: sportsbookConfiguration.clientInterfaceIdentifier
            })).respond([
            mockApiResponseFactory.getCategory({
                "cn": "C'æ",
                "rl": [
                    mockApiResponseFactory.getRegion({
                        "rn": "声হ♥",
                        "scl": [
                            mockApiResponseFactory.getSubCategory({
                                "scn": "াসি`'.a"
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

            expect(category.slug).toBe(["", initialTestMarket.urlMarketCode, "cae"].join("/"));
            expect(region.slug).toBe(["", initialTestMarket.urlMarketCode, "cae/love"].join("/"));
            expect(subCategory.slug).toBe(["", initialTestMarket.urlMarketCode, "cae/love/a"].join("/"));

            done();
        });

        $httpBackend.flush();
    });
});
