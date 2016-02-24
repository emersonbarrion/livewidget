// ReSharper disable UseOfImplicitGlobalInFunctionScope
describe('Configuration: Web API Configuration Helper', function () {

    var config, state, rootScope, testCulture;

    beforeEach(module('sportsbook.configuration'));

    beforeEach(inject(["$rootScope", "apiConfig", "applicationState", "$q", function ($rootScope, apiConfig, applicationState, $q) {
        config = apiConfig;
        state = applicationState;
        rootScope = $rootScope;
        testCulture = {
            urlMarketCode: "en"
        };

        var culturePromise = $q.defer();
        culturePromise.resolve(testCulture);

        spyOn(applicationState, "culture").and.returnValue(culturePromise.promise);
    }]));

    it("Should generate urls with the given version", function (done) {

        config.url = "http://api.test.com";
        config.version = "1";

        state.culture(testCulture).then(function () {
            config.urlFor({
                path: "/home"
            }).then(function (url) {
                expect(url).toEqual("http://api.test.com/en/1/home");
                done();
            });
        });

        rootScope.$apply();
    });

    it("Should use the market code instead of the culture if provided", function (done) {

        config.url = "http://api.test.com";
        config.version = "1";

        state.culture(testCulture).then(function () {
            config.urlFor({
                path: "/home",
                urlMarketCode: "jp"
            }).then(function (url) {
                expect(url).toEqual("http://api.test.com/jp/1/home");
                done();
            });
        });

        rootScope.$apply();
    });

    it("Should generate urls with the given url", function (done) {

        config.url = "http://api.test.com";
        config.version = "1";

        state.culture(testCulture).then(function () {
            config.urlFor({
                path: "/test"
            }).then(function (url) {
                expect(url).toEqual("http://api.test.com/en/1/test");
                done();
            });
        });
        rootScope.$apply();
    });

    it("Should generate service urls with the given url", function (done) {

        config.directUrl = "http://other.api.test.com";

        state.culture(testCulture).then(function () {
            config.directUrlFor({
                path: "/test"
            }).then(function (url) {
                expect(url).toEqual("http://other.api.test.com/test");
                done();
            });
        });
        rootScope.$apply();
    });
});
