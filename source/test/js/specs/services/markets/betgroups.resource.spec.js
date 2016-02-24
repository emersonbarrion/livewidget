describe("Resource: Betgroups", function () {
    "use strict";

    var $httpBackend, $q, resource, prematchSession, sportsbookConfiguration;

    beforeEach(module("sportsbook.markets", ["sportsbookConfigurationProvider", function (sportsbookConfigurationProvider) {
        sportsbookConfigurationProvider.config = {
            categoryMappingSource: "/js/config/category-mappings.js",
            services: {
                isaUrl: "http://www.test.com"
            }
        };
    }]));

    beforeEach(inject(["$httpBackend", "$q", "betGroupsResource", "prematchSession", "sportsbookConfiguration", function (httpBackend, _$q_, betGroupsResource, _prematchSession_, _sportsbookConfiguration_) {
        $httpBackend = httpBackend;
        $q = _$q_;
        resource = betGroupsResource;
        prematchSession = _prematchSession_;
        sportsbookConfiguration = _sportsbookConfiguration_;
    }]));

    it("should convert the response to the sitestack sportsbook model.", function (done) {
        spyOn(prematchSession, "getSessionInfo").and.returnValue($q.when({
            "segmentId": 601,
            "token": "TEST_TOKEN"
        }));

        $httpBackend.when("GET", sportsbookConfiguration.services.isaUrl + "/601/en/betgroup/1,2,3").respond([{
            "bgi": 1,
            "bgn": "Betgroup 1"
        }, {
            "bgi": 2,
            "bgn": "Betgroup 2"
        }, {
            "bgi": 3,
            "bgn": "Betgroup 3"
        }]);

        resource.query({
            "ids": "1,2,3"
        }, {
            "languageCode": "en"
        }).then(function (results) {

            expect(results[0].betGroupId).toBe(1);
            expect(results[0].name).toBe("Betgroup 1");

            expect(results[1].betGroupId).toBe(2);
            expect(results[1].name).toBe("Betgroup 2");

            expect(results[2].betGroupId).toBe(3);
            expect(results[2].name).toBe("Betgroup 3");

            done();
        });

        $httpBackend.flush();
    });
});
