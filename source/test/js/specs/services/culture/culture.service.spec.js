describe("Services: Cutlure", function() {

    var service, backend, cfg;

    beforeEach(module("angular-sitestack-culture"));

    beforeEach(inject(['$q', 'sitestackApiConfig', '$httpBackend', function($q, sitestackApiConfig, $httpBackend) {
        backend = $httpBackend;
        cfg = sitestackApiConfig;

        cfg.urlFor = function(options) {
            return $q.when(cfg.url + options.path);
        };
    }]));

    beforeEach(inject(["cultureService", function (cultureService) {
        service = cultureService;
    }]));

    beforeEach(function(done) {
        done();
    });

    it("Should load culture", function(done) {

        backend.when("GET", cfg.url + "/site-market").respond({
            it: "ok"
        });

        service.getCulture().then(function(result) {
            expect(result.it).toBe("ok");
            done();
        });

        backend.flush();
    });

});
