describe("Services: Catalogue", function () {

    var service, cfg, q, $rootScope;

    beforeEach(module("sportsbook.catalogue"));

    beforeEach(inject(["$q", "apiConfig", "applicationState", "$rootScope", "$httpBackend", "sportsbookConfiguration", function ($q, apiConfig, applicationState, _$rootScope_, $httpBackend, sportsbookConfiguration) {

        $rootScope = _$rootScope_;
        cfg = apiConfig;

        q = $q;

        cfg.urlFor = function (options) {
            return $q.when(cfg.url + options.path);
        };

        applicationState.culture({
            "countryCode": "GB",
            "cultureInfo": "en-GB",
            "currencyCode": "GBP",
            "currencySymbol": "£",
            "dateFormat": "dd/MM/yy",
            "id": 601,
            "languageCode": "en",
            "name": "English",
            "numberFormat": ".",
            "timeFormat": "HH:mm",
            "urlMarketCode": "en"
        });

        sportsbookConfiguration.services.isaUrl = "http://www.test.com";
        $httpBackend.when("GET", "http://www.test.com/601/en/category?eventPhase=1").respond([]);
    }]));

    beforeEach(inject(["catalogueService", function (catalogueService) {
        service = catalogueService;
    }]));

    it("Should build a collection from the event hierarchy", function (done) {

        var r = q.defer();
        spyOn(service, "getMenu").and.returnValue(r.promise);

        var competition1 = {"id": 3, "children": [4, 5]};
        var competition2 = {"id": 6, "children": [7]};
        var competition3 = {"id": 10, "children": [11, 12, 13]};

        var region1 = {"id": 2, "children": [competition1, competition2]};
        var region2 = {"id": 9, "children": [competition3]};

        var category = {"id": 1, "children": [region1, region2]};

        r.resolve([category]);

        service.getEventMap({menuType: 1}).then(function (result) {
            expect(result.length).toBe(6);

            expect(result[0].event).toBe(4);
            expect(result[0].competition).toBe(competition1);
            expect(result[0].region).toBe(region1);
            expect(result[0].category).toBe(category);
            expect(result[1].event).toBe(5);
            expect(result[1].competition).toBe(competition1);
            expect(result[1].region).toBe(region1);
            expect(result[1].category).toBe(category);
            expect(result[2].event).toBe(7);
            expect(result[2].competition).toBe(competition2);
            expect(result[2].region).toBe(region1);
            expect(result[2].category).toBe(category);
            expect(result[3].event).toBe(11);
            expect(result[3].competition).toBe(competition3);
            expect(result[3].region).toBe(region2);
            expect(result[3].category).toBe(category);
            expect(result[4].event).toBe(12);
            expect(result[4].competition).toBe(competition3);
            expect(result[4].region).toBe(region2);
            expect(result[4].category).toBe(category);
            expect(result[5].event).toBe(13);
            expect(result[5].competition).toBe(competition3);
            expect(result[5].region).toBe(region2);
            expect(result[5].category).toBe(category);

            done();
        });

        $rootScope.$apply();
    });

    describe("getMenu", function () {
        var catalogueResource;

        beforeEach(inject(["catalogueResource", "$httpBackend", function (_catalogueResource_) {
            catalogueResource = _catalogueResource_;
        }]));

        it("Should throw an error on failure", function (done) {
            spyOn(catalogueResource, "query").and.returnValue(q.reject());

            service.getMenu({menuType: 1}).then(function (result) {
                expect(true).toBe(false);
                done();
            }).catch(function (result) {
                expect(result).toBe(undefined);
                done();
            });

            $rootScope.$apply();
        });
    });

    describe("getCompetitionsById", function () {

        it("should retrieve the specified competitions", function (done) {

            var r = q.defer();

            spyOn(service, "getEventMap").and.returnValue(r.promise);

            service.getCompetitionsById([1, 2, 4, 5]).then(function (competitions) {

                expect(competitions.length).toBe(3);
                expect(competitions[0].id).toBe(1);
                expect(competitions[1].id).toBe(2);
                expect(competitions[2].id).toBe(4);
                done();
            });

            r.resolve([
                {"competition": {"id": 1}, "event": {"id": 1}, "region": {"id": 1}, "category": {"id": 1}},
                {"competition": {"id": 1}, "event": {"id": 2}, "region": {"id": 1}, "category": {"id": 1}},
                {"competition": {"id": 1}, "event": {"id": 3}, "region": {"id": 1}, "category": {"id": 1}},
                {"competition": {"id": 2}, "event": {"id": 4}, "region": {"id": 1}, "category": {"id": 1}},
                {"competition": {"id": 2}, "event": {"id": 5}, "region": {"id": 1}, "category": {"id": 1}},
                {"competition": {"id": 2}, "event": {"id": 6}, "region": {"id": 1}, "category": {"id": 1}},
                {"competition": {"id": 3}, "event": {"id": 7}, "region": {"id": 1}, "category": {"id": 1}},
                {"competition": {"id": 3}, "event": {"id": 8}, "region": {"id": 1}, "category": {"id": 1}},
                {"competition": {"id": 3}, "event": {"id": 9}, "region": {"id": 1}, "category": {"id": 1}},
                {"competition": {"id": 4}, "event": {"id": 10}, "region": {"id": 1}, "category": {"id": 1}}
            ]);

            $rootScope.$apply();
        });

        it("should reject if invalid parameters are provided", function (done) {
            service.getCompetitionsById("bleh").then(function () {
            }, function (reason) {
                expect(reason).toBe("The ids parameter should be an array of numeric values");
                done();
            });

            $rootScope.$apply();
        });
    });

    describe("_search", function () {

        it("should return undefined if map or element are missing", function () {

            expect(service._search(null, {})).toBeUndefined();
            expect(service._search({}, null)).toBeUndefined();
        });
    });

    describe("getCategory", function () {

        it("Should select category", function (done) {

            var r = q.defer();

            spyOn(service, "getEventMap").and.returnValue(r.promise);

            r.resolve([
                {"category": {"slug": "/a"}, "region": {"slug": "/a/1"}},
                {"category": {"slug": "/a"}, "region": {"slug": "/a/2"}},
                {"category": {"slug": "/b"}, "region": {"slug": "/b/1"}}
            ]);

            service.getCategory({category: "b"}).then(function (result) {
                expect(result.slug).toBe("/b");
                done();
            });

            $rootScope.$apply();
        });

        it("Should select category by id", function (done) {

            var r = q.defer();

            spyOn(service, "getEventMap").and.returnValue(r.promise);

            r.resolve([
                {"category": {"id": 1, "slug": "/a"}, "region": {"id": 1, "slug": "/a/1"}},
                {"category": {"id": 1, "slug": "/a"}, "region": {"id": 2, "slug": "/a/2"}},
                {"category": {"id": 2, "slug": "/b"}, "region": {"id": 3, "slug": "/b/1"}}
            ]);

            service.getCategory({"id": 1}).then(function (result) {
                expect(result.slug).toBe("/a");
                done();
            });

            $rootScope.$apply();
        });

        it("Should select region", function (done) {

            var r = q.defer();

            spyOn(service, "getEventMap").and.returnValue(r.promise);

            service.getRegion({category: "b", region: "1"}).then(function (result) {
                expect(result.slug).toBe("/b/1");
                done();
            });

            r.resolve([
                {"category": {"slug": "/a"}, "region": {"slug": "/a/1"}},
                {"category": {"slug": "/a"}, "region": {"slug": "/a/2"}},
                {"category": {"slug": "/b"}, "region": {"slug": "/b/1"}}
            ]);
            $rootScope.$apply();
        });

        it("Should select region by id", function (done) {

            var r = q.defer();

            spyOn(service, "getEventMap").and.returnValue(r.promise);

            r.resolve([
                {"category": {"id": 1, "slug": "/a"}, "region": {"id": 1, "slug": "/a/1"}},
                {"category": {"id": 1, "slug": "/a"}, "region": {"id": 2, "slug": "/a/2"}},
                {"category": {"id": 2, "slug": "/b"}, "region": {"id": 3, "slug": "/b/1"}}
            ]);

            service.getRegion({"id": 3}).then(function (result) {
                expect(result.slug).toBe("/b/1");
                done();
            });

            $rootScope.$apply();
        });

        it("Should select competition", function (done) {
            var r = q.defer();
            spyOn(service, "getEventMap").and.returnValue(r.promise);

            r.resolve([
                {"category": {"slug": "/a"}, "region": {"slug": "/a/1"}, "competition": {"slug": "/a/1/i"}},
                {"category": {"slug": "/a"}, "region": {"slug": "/a/1"}, "competition": {"slug": "/a/1/j"}},
                {"category": {"slug": "/a"}, "region": {"slug": "/a/2"}, "competition": {"slug": "/a/2/k"}},
                {"category": {"slug": "/a"}, "region": {"slug": "/a/2"}, "competition": {"slug": "/a/2/l"}}
            ]);

            service.getCompetition({category: "a", region: "1", competition: "i"}).then(function (result) {
                expect(result.slug).toBe("/a/1/i");
                done();
            });

            $rootScope.$apply();
        });

        it("Should select competition by id", function (done) {
            var r = q.defer();
            spyOn(service, "getEventMap").and.returnValue(r.promise);

            r.resolve([
                {
                    "category": {"id": 1, "slug": "/a"},
                    "region": {"id": 1, "slug": "/a/1"},
                    "competition": {"id": 1, "slug": "/a/1/i"}
                },
                {
                    "category": {"id": 1, "slug": "/a"},
                    "region": {"id": 1, "slug": "/a/1"},
                    "competition": {"id": 2, "slug": "/a/1/j"}
                },
                {
                    "category": {"id": 1, "slug": "/a"},
                    "region": {"id": 2, "slug": "/a/2"},
                    "competition": {"id": 3, "slug": "/a/2/k"}
                },
                {
                    "category": {"id": 1, "slug": "/a"},
                    "region": {"id": 2, "slug": "/a/2"},
                    "competition": {"id": 4, "slug": "/a/2/l"}
                }
            ]);

            service.getCompetition({"id": 4}).then(function (result) {
                expect(result.slug).toBe("/a/2/l");
                done();
            });

            $rootScope.$apply();
        });

        it("Should reject if competition cannot be found", function (done) {

            var r = q.defer();
            spyOn(service, "getEventMap").and.returnValue(r.promise);

            r.resolve([
                {"category": {"slug": "/a"}, "region": {"slug": "/a/1"}, "competition": {"slug": "/a/1/i"}},
                {"category": {"slug": "/a"}, "region": {"slug": "/a/1"}, "competition": {"slug": "/a/1/j"}},
                {"category": {"slug": "/a"}, "region": {"slug": "/a/2"}, "competition": {"slug": "/a/2/k"}},
                {"category": {"slug": "/a"}, "region": {"slug": "/a/2"}, "competition": {"slug": "/a/2/l"}}
            ]);

            service.getCompetition({category: "a", region: "1", competition: "z"}).then(function () {

            }, function (result) {
                expect(result).toEqual(jasmine.objectContaining({
                    "message": "Could not find competition",
                    "parameters": jasmine.objectContaining({"category": "a", "region": "1", "competition": "z"}),
                    "errorCode": 404
                }));
                done();
            });

            $rootScope.$apply();
        });

        it("Should reject if region cannot be found when looking for competition", function (done) {

            var r = q.defer();
            spyOn(service, "getEventMap").and.returnValue(r.promise);

            r.resolve([
                {"category": {"slug": "/a"}, "region": {"slug": "/a/1"}, "competition": {"slug": "/a/1/i"}},
                {"category": {"slug": "/a"}, "region": {"slug": "/a/1"}, "competition": {"slug": "/a/1/j"}},
                {"category": {"slug": "/a"}, "region": {"slug": "/a/2"}, "competition": {"slug": "/a/2/k"}},
                {"category": {"slug": "/a"}, "region": {"slug": "/a/2"}, "competition": {"slug": "/a/2/l"}}
            ]);

            service.getCompetition({category: "a", region: "8", competition: "i"}).then(function () {

            }, function (result) {
                expect(result).toEqual(jasmine.objectContaining({
                    "message": "Could not find competition",
                    "parameters": jasmine.objectContaining({"category": "a", "region": "8", "competition": "i"}),
                    "errorCode": 404
                }));
                done();
            });

            $rootScope.$apply();
        });

        it("getCompetition should reject if the event map cannot be loaded.", function (done) {

            var r = q.defer();
            spyOn(service, "getEventMap").and.returnValue(r.promise);

            r.reject("boom.");

            service.getCompetition({category: "a"}).then(function () {
            }, function (rejection) {
                expect(rejection).toBe("boom.");
                done();
            });

            $rootScope.$apply();
        });

        it("getRegion should reject if the event map cannot be loaded.", function (done) {

            var r = q.defer();
            spyOn(service, "getEventMap").and.returnValue(r.promise);

            r.reject("boom.");

            service.getRegion({category: "a", region: "8"}).then(function () {
            }, function (rejection) {
                expect(rejection).toBe("boom.");
                done();
            });

            $rootScope.$apply();
        });

        it("getCompetition should reject if the event map cannot be loaded.", function (done) {

            var r = q.defer();
            spyOn(service, "getEventMap").and.returnValue(r.promise);

            r.reject("boom.");

            service.getCompetition({category: "a", region: "8", competition: "i"}).then(function () {
            }, function (rejection) {
                expect(rejection).toBe("boom.");
                done();
            });

            $rootScope.$apply();
        });

        it("Should reject if the category cannot be found", function (done) {
            var r = q.defer();
            spyOn(service, "getMenu").and.returnValue(r.promise);

            r.resolve([{
                slug: "/a"
            }, {
                slug: "/b"
            }, {
                slug: "/c"
            }]);

            service.getCategory({category: "x"}).then(function (result) {
                fail();
                done();
            }, function (result) {
                expect(result).toEqual(jasmine.objectContaining({
                    "message": "Could not find category",
                    "parameters": jasmine.objectContaining({"category": "x"}),
                    "errorCode": 404
                }));
                done();
            });

            $rootScope.$apply();
        });
    });
});
