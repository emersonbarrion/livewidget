describe("Services: Widgets", function () {

    var service, backend, rootScope;

    beforeEach(module("sportsbook.configuration"));

    beforeEach(inject(["$httpBackend", "$rootScope", "apiConfig", "$q", "applicationState", function ($httpBackend, $rootScope, apiConfig, $q, applicationState) {
        backend = $httpBackend;
        rootScope = $rootScope;
        var cfg = apiConfig;

        cfg.urlFor = function (path) {
            return $q.when(cfg.url + path);
        };

        applicationState.culture({
            urlMarketCode: "en"
        });
    }]));

    beforeEach(inject(["widgetConfigurations", function (widgetConfigurations) {
        service = widgetConfigurations;
    }]));

    it("should pick a section from a specified configuration", function (done) {

        backend.when("GET", "/templates/config/widgets/cfg-en-widgets.js").respond({
            "cheese-rolling": [{
                name: "winners"
            }, {
                name: "injuries"
            }, {
                name: "other"
            }]
        });

        service.getForSection("cheese-rolling", "winners").then(function (result) {
            expect(result.name).toBe("winners");
            done();
        });

        backend.flush();
    });

    it("should return the entire configuration if no section is specified", function (done) {

        backend.when("GET", "/templates/config/widgets/cfg-en-widgets.js").respond({
            "cheese-rolling": [{
                name: "winners"
            }, {
                name: "injuries"
            }, {
                name: "other"
            }]
        });

        service.getForCategory("cheese-rolling").then(function (result) {
            expect(result[0].name).toBe("winners");
            expect(result[1].name).toBe("injuries");
            expect(result[2].name).toBe("other");
            done();
        });

        backend.flush();
    });

    it("should reject if the specified section was not found", function (done) {

        backend.when("GET", "/templates/config/widgets/cfg-en-widgets.js").respond({
            "cheese-rolling": [{
                name: "winners"
            }, {
                name: "injuries"
            }, {
                name: "other"
            }]
        });

        service.getForSection("cheese-rolling", "hilarious").then(function (result) {
            fail();
        }).catch(function (error) {
            expect(error).toBeDefined();
            done();
        });

        backend.flush();
    });

    it("should reject if the URL was empty", function (done) {
        service.get().then(function (result) {
            fail();
            done();
        }).catch(function (error) {
            expect(error).toBeDefined();
            done();
        });

        backend.flush();
    });

    it("should reject if the marketCode was empty", function (done) {
        service.getForMarket().then(function (result) {
            fail();
            done();
        }).catch(function (error) {
            expect(error).toBeDefined();
            done();
        });

        backend.flush();
        rootScope.$digest();
    });

    it("should reject if the categoryId was empty", function (done) {
        service.getForCategory().then(function (result) {
            fail();
            done();
        }).catch(function (error) {
            expect(error).toBeDefined();
            done();
        });

        backend.flush();
        rootScope.$digest();
    });

    it("should reject if the section was empty", function (done) {
        service.getForSection("1").then(function (result) {
            fail();
            done();
        }).catch(function (error) {
            expect(error).toBeDefined();
            done();
        });

        rootScope.$digest();
    });


});
