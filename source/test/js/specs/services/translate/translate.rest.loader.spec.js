describe('Factories: Translation loader', function () {

    var loader, httpBackend;

    beforeEach(module("sportsbook.application"));
    beforeEach(module('sportsbook.translate'));

    beforeEach(inject(["$httpBackend", "$q", "sitestackApiConfig", "$injector", function ($httpBackend, $q, apiConfig, $injector) {
        
        apiConfig.urlFor = function() {
            return $q.when("http://www.test.com");
        };

        httpBackend = $httpBackend;
        loader = $injector.get("translate.rest.loader");        
    }]));

    beforeEach(function(done) {
        done();
    });

    describe("Normal operation", function () {
        beforeEach(function() {
            httpBackend.when("POST", "http://www.test.com").respond({ "it": "works" });
        });

        it("Should load localized data", function (done) {

            loader({ key: "test", bundles: ["abcd"] }).then(function (result) {
                expect(result.it).toBe("works");
                done();
            });

            httpBackend.flush();
        });
    });

    describe("Error handling", function () {
        beforeEach(function () {
            httpBackend.when("POST", "http://www.test.com").respond(500, "error");
        });

        it("Should return the failing key", function (done) {

            loader({ key: "test", bundles: ["abcd"] }).then(
                function () {
                    fail();
                    done();
                },
                function (result) {
                    expect(result).toBe("test");
                    done();
                });

            httpBackend.flush();
        });
    });
});