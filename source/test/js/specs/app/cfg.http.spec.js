describe("Configuration: Http Interceptors", function() {

    var $http, $httpProvider, $httpBackend;

    beforeEach(module("sportsbook-app",["$httpProvider", function(_$httpProvider_) {
        $httpProvider = _$httpProvider_;
    }]));

    beforeEach(inject(["$http", "$httpBackend", "siteStackConfiguration", function(_$http_, _$httpBackend_, siteStackConfiguration) {        
        $httpBackend = _$httpBackend_;
        $http = _$http_;
        $httpBackend.when("GET", siteStackConfiguration.routingConfiguration + "cfg-en-default.js").respond([]);
    }]));

    it("Should log errors", function() {

        spyOn(console, 'log');

        var httpResponse;

        $http.get('/fail').then(
            function () { },
            function (response) {
                httpResponse = response;
            });

        $httpBackend.whenGET('/fail').respond(401);
        $httpBackend.flush();

        expect(console.log).toHaveBeenCalledWith("HTTP ERROR [401] - /fail");
    });
});