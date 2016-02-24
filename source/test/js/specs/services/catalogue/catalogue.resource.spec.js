describe("Resource: Catalogue", function () {

    var resource, httpBackend, CacheFactory, applicationState, $rootScope, $q, mockCache;

    beforeEach(module("sportsbook.catalogue"));

    beforeEach(inject(["$rootScope", "CacheFactory", "$httpBackend", "sportsbookConfiguration", "catalogueMappings", "$q", "applicationState", "prematchSession", function (_$rootScope_, cacheFactory, $httpBackend, sportsbookConfiguration, catalogueMappings, _$q_, _applicationState_, _prematchSession_) {
        $rootScope = _$rootScope_;
        httpBackend = $httpBackend;
        CacheFactory = cacheFactory;
        catalogueMapping = catalogueMappings;
        applicationState = _applicationState_;
        prematchSession = _prematchSession_;
        $q = _$q_;
        mockCache = {
            get: function () {},
            put: function () {},
            removeAll: function () {}
        };

        sportsbookConfiguration.services.isaUrl = "http://www.test.com";
        sportsbookConfiguration.clientInterfaceIdentifier = "TEST_CUSTOMER_ID";

        $httpBackend.when("POST", "http://api-v0.sportsbook.betsson.sitestack.mylocal/undefined/1/i10n").respond([]);

        spyOn(prematchSession, "getSessionInfo").and.returnValue($q.when({
            "segmentId": 601,
            "token": "TEST_TOKEN"
        }));
        // Set up network expectations.
        httpBackend
            .when("GET", "http://www.test.com/601/en/category?eventPhase=1&ocb=TEST_CUSTOMER_ID")
            .respond([{
                "ci": 1,
                "cn": "Test Category",
                "mc": 2,
                "sr": {
                    "dso": 1,
                    "pbbpoe": 2
                },
                "rl": [{
                    "ri": 2,
                    "rn": "Test Region 1",
                    "mc": 1,
                    "so": 1,
                    "scl": [{
                        "sci": 4,
                        "scn": "Test Sub    Category 1",
                        "mc": 1,
                        "so": 1,
                        "el": [
                            1, {
                                "ei": 2,
                                "sd": "2016-01-26T19:45:00Z",
                                "mc": 10
                            }
                        ]
                    }]
                }, {
                    "ri": 3,
                    "rn": "Test Region 2",
                    "mc": 1,
                    "sr": {
                        "dso": 1,
                        "pbbpoe": 2
                    },
                    "scl": [{
                        "sci": 5,
                        "scn": null, // This should never happen in production, but some results returned from .local have null names.
                        "sl": [{
                            "st": 3,
                            "sp": 3,
                            "si": 12
                        }],
                        "mc": 1,
                        "sr": {
                            "dso": 1,
                            "pbbpoe": 2
                        },
                    }]
                }]
            }]);

        spyOn(CacheFactory, "get").and.returnValue(mockCache);
    }]));

    beforeEach(inject(["catalogueResource", function (catalogueResource) {
        resource = catalogueResource;
    }]));

    it("should request details from the sportsbook service.", function (done) {
        applicationState.user({
            "isAuthenticated": false
        });

        spyOn(catalogueMapping, "byId").and.returnValue($q.when({
            "name": "test-catgeory"
        }));

        var culture = {
            "languageCode": "en",
        };

        resource.query(culture, 1).then(function (result) {

            expect(result).toBeDefined();
            expect(result.length).toBe(1);

            var category = result[0];
            expect(category.id).toBe(1);
            expect(category.name).toBe("Test Category");
            expect(category.marketCount).toBe(2);
            expect(category.eventCount).toBe(2);
            expect(category.type).toBe("Category");
            expect(category.sortRank.defaultSortOrder).toBe(1);
            expect(category.sortRank.popularityRank).toBe(2);
            expect(category.slug).toBe("/en/test-category");

            expect(category.children).toBeDefined();

            var regions = category.children;
            expect(regions.length).toBe(2);

            expect(regions[0].id).toBe(2);
            expect(regions[0].name).toBe("Test Region 1");
            expect(regions[0].marketCount).toBe(1);
            expect(regions[0].eventCount).toBe(2);
            expect(regions[0].type).toBe("Region");
            expect(regions[0].sortOrder).toBe(1);
            expect(regions[0].slug).toBe("/en/test-category/test-region-1");
            expect(regions[0].children).toBeDefined();

            expect(regions[0].children[0].name).toBe("Test Sub    Category 1");
            expect(regions[0].children[0].marketCount).toBe(1);
            expect(regions[0].children[0].type).toBe("Competition");
            expect(regions[0].children[0].sortOrder).toBe(1);
            expect(regions[0].children[0].slug).toBe("/en/test-category/test-region-1/test-sub-category-1");

            expect(regions[0].children[0].children[0]).toBe(1);
            expect(regions[0].children[0].children[1].id).toBe(2);
            expect(regions[0].children[0].children[1].startDate.getUTCFullYear()).toBe(2016);

            expect(regions[1].id).toBe(3);
            expect(regions[1].name).toBe("Test Region 2");
            expect(regions[1].marketCount).toBe(1);
            expect(regions[1].eventCount).toBe(0);
            expect(regions[1].type).toBe("Region");
            expect(regions[1].sortRank.defaultSortOrder).toBe(1);
            expect(regions[1].sortRank.popularityRank).toBe(2);
            expect(regions[1].slug).toBe("/en/test-category/test-region-2");
            expect(regions[1].children).toBeDefined();

            expect(regions[1].children[0].name).toBeNull();
            expect(regions[1].children[0].marketCount).toBe(1);
            expect(regions[1].children[0].type).toBe("Competition");
            expect(regions[1].children[0].sortRank.defaultSortOrder).toBe(1);
            // Response from the sportsbook changed
            //expect(regions[1].children[0].externalId).toBe(12);
            expect(regions[1].children[0].slug).toBe("/en/test-category/test-region-2/null");

            done();
        });

        $rootScope.$digest();
        httpBackend.flush();
    });
});
