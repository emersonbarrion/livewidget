describe("SSK-1215 Catalogue phase filter", function () {

    beforeEach(module("sportsbook.tests"));

    var filter,
        catalogue,
        liveCatalogueService,
        $httpBackend,
        $rootScope,
        mockApiResponseFactory,
        testCategories,
        testLiveCategories;

    beforeEach(function () {

        inject(["$filter", "$httpBackend", "$rootScope", "liveCatalogueService", "mockApiResponseFactory", "catalogue", function ($filter, _$httpBackend_, _$rootScope_, _liveCatalogueService_, _mockApiResponseFactory_, _catalogue_) {
            filter = $filter("cataloguePhase");
            catalogue = _catalogue_;
            liveCatalogueService = _liveCatalogueService_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            mockApiResponseFactory = _mockApiResponseFactory_;
        }]);

        testCategories = [
            mockApiResponseFactory.getCategory()
        ];

        testLiveCategories = [
            mockApiResponseFactory.getCategory()
        ];

        $httpBackend.when("GET", "http://isaUrl.test.com/601/en/category?ci=null&eventPhase=0").respond(testCategories);
        $httpBackend.when("GET", "http://isaUrl.test.com/601/en/category?eventPhase=0&ocb=TEST_CUSTOMER_ID").respond(testCategories);
        $httpBackend.when("GET", "http://isaUrl.test.com/601/en/category?eventPhase=2&ocb=TEST_CUSTOMER_ID").respond(testLiveCategories);

        liveCatalogueService.isActive = true;
    });

    it("should filter the catalogue for live events", function (done) {
        testCategories[0].rl[0].scl[0].el = [
            mockApiResponseFactory.getCompactEvent({
                "ei": 5000,
                "cep": 2
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5001
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5002,
                "cep": 2
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5003
            })
        ];

        testLiveCategories[0].rl[0].scl[0].el = [
            mockApiResponseFactory.getCompactEvent({
                "ei": 5000,
                "cep": 2
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5002,
                "cep": 2
            })
        ];

        var catalogueList;

        catalogue.getMenu().then(function (menu) {
            catalogueList = menu;
        });

        liveCatalogueService.reload();

        $httpBackend.flush();

        var filteredCatalogueList = filter(catalogueList, 2);

        expect(filteredCatalogueList[0].children[0].children.length).toBe(1);

        done();
    });

    it("should filter the catalogue for prematch events", function (done) {
        testCategories[0].rl[0].scl[0].el = [
            mockApiResponseFactory.getCompactEvent({
                "ei": 5000,
                "cep": 2
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5001
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5002,
                "cep": 2
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5003
            })
        ];

        testLiveCategories[0].rl[0].scl[0].el = [
            mockApiResponseFactory.getCompactEvent({
                "ei": 5000,
                "cep": 2
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5002,
                "cep": 2
            })
        ];

        var catalogueList;

        catalogue.getMenu().then(function (menu) {
            catalogueList = menu;
        });

        liveCatalogueService.reload();

        $httpBackend.flush();
        $rootScope.$digest();

        var filteredCatalogueList = filter(catalogueList, 1);

        expect(filteredCatalogueList[0].children[0].children.length).toBe(1);

        done();
    });

    it("should filter the catalogue for all events", function (done) {
        testCategories[0].rl[0].scl[0].el = [
            mockApiResponseFactory.getCompactEvent({
                "ei": 5000,
                "cep": 2
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5001
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5002,
                "cep": 2
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5003
            })
        ];

        var catalogueList;

        catalogue.getMenu().then(function (menu) {
            catalogueList = menu;
        });

        liveCatalogueService.reload();

        $httpBackend.flush();
        $rootScope.$digest();

        var filteredCatalogueList = filter(catalogueList, 0);

        expect(filteredCatalogueList[0].children[0].children.length).toBe(1);

        done();
    });

    it("should update the catalogue according to new live events in the API", function (done) {
        testCategories[0].rl[0].scl[0].el = [
            mockApiResponseFactory.getCompactEvent({
                "ei": 5000
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5001
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5002
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5003
            })
        ];

        var catalogueList;
        catalogue.getMenu().then(function (menu) {
            catalogueList = menu;
        });
        liveCatalogueService.reload();
        $httpBackend.flush();
        $rootScope.$digest();

        var filteredCatalogueList = filter(catalogueList, 2);
        expect(filteredCatalogueList.length).toBe(0);

        testLiveCategories[0].rl[0].scl[0].el = [
            mockApiResponseFactory.getCompactEvent({
                "ei": 5000,
                "cep": 2
            }),
            mockApiResponseFactory.getCompactEvent({
                "ei": 5002,
                "cep": 2
            })
        ];
        liveCatalogueService.reload();
        $httpBackend.flush();

        filteredCatalogueList = filter(catalogueList, 2);
        expect(filteredCatalogueList[0].children[0].children.length).toBe(1);

        done();
    });
});
