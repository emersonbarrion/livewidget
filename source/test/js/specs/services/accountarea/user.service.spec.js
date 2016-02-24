describe("Services: User Service", function() {

    var service, cfg, $httpBackend;

    beforeEach(module('demo.authentication'));

    beforeEach(inject(["sitestackApiConfig", "userService", "$httpBackend", "$q", function (apiConfig, userService, _$httpBackend_, $q) {
        $httpBackend = _$httpBackend_;
        cfg = apiConfig;
        service = userService;

        cfg.urlFor = function(options) {
            return $q.when("http://www.test.com" + options.path);
        };
    }]));

    beforeEach(function(done) {
        done();
    });

    it("Should send authentication requests to the web service", function(done) {

        $httpBackend.when("POST", "http://www.test.com/user/auth/login").respond({ "ok": true });

        service.login({ username: "username", password: "password" }).then(function (data) {
            expect(data.ok).toBe(true);
            done();
        });

        $httpBackend.flush();
    });

    it("Should send logout requests to the web service", function (done) {

        $httpBackend.when("POST", "http://www.test.com/user/auth/logout").respond({ "ok": true });

        service.logout().then(function (data) {
            expect(data.ok).toBe(true);
            done();
        });

        $httpBackend.flush();
    });

    it("Should send auth requests to the web service", function (done) {

        $httpBackend.when("GET", "http://www.test.com/user/auth").respond({ "ok": true });

        service.isLoggedIn().then(function (data) {
            expect(data.ok).toBe(true);
            done();
        });

        $httpBackend.flush();
    });

    it("Should send balance requests to the web service", function (done) {

        $httpBackend.when("GET", "http://www.test.com/user/details/balance").respond({ "ok": true });

        service.getBalance().then(function (data) {
            expect(data.ok).toBe(true);
            done();
        });

        $httpBackend.flush();
    });

    it("Should pass login errors to the failure callback if present", function (done) {

        $httpBackend.when("POST", "http://www.test.com/user/auth/login").respond(500);

        service.login({ username: "username", password: "password" }).then(
            function () { },
            function (response) {
                expect(response.status).toBe(500);
                done();
            }
        );

        $httpBackend.flush();
    });

    it("Should pass logout errors to the failure callback if present", function (done) {

        $httpBackend.when("POST", "http://www.test.com/user/auth/logout").respond(500);

        service.logout().then(
            function () { },
            function (response) {
                expect(response.status).toBe(500);
                done();
            }
        );

        $httpBackend.flush();
    });

    it("Should pass auth errors to the failure callback if present", function (done) {

        $httpBackend.when("GET", "http://www.test.com/user/auth").respond(500);

        service.isLoggedIn().then(
            function () { },
            function (response) {
                expect(response.status).toBe(500);
                done();
            }
        );

        $httpBackend.flush();
    });

    it("Should pass balance errors to the failure callback if present", function (done) {

        $httpBackend.when("GET", "http://www.test.com/user/details/balance").respond(401);

        service.getBalance().then(
            function () { },
            function (response) {
                expect(response.status).toBe(401);
                done();
            }
        );

        $httpBackend.flush();
    });

});