describe("Services: PrematchSession GetSessionInfo", function () {

    var prematchSession, $httpBackend;

    beforeEach(module('sportsbook.session'));

    beforeEach(inject(["prematchSession", "applicationState", "$httpBackend", "siteStackConfiguration", "$q", "sportsbookConfiguration", function (_prematchSession_, applicationState, _$httpBackend_, siteStackConfiguration, $q, sportsbookConfiguration) {
        prematchSession = _prematchSession_;
        $httpBackend = _$httpBackend_;

        applicationState.culture({
            id: 601,
            urlMarketCode: "en"
        });

        siteStackConfiguration.services.sessionInfo = "endpoint";
        sportsbookConfiguration.services.customerApi = "loginEndpoint";
    }]));

    it("should return prematch session information on success", function (done) {
        var serverResult = { segmentId: 1, token: "token" };
        $httpBackend.when("POST", "endpoint").respond(200, serverResult);
        $httpBackend.when("GET", "loginEndpoint/login?segmentId=1&sessionId=token").respond(200);

        prematchSession.getSessionInfo().then(function (sessionInfo) {
            expect(sessionInfo).toEqual(serverResult);
            done();
        });

        $httpBackend.flush();
    });

    it("should reject on failure", function () {
        $httpBackend.when("POST", "endpoint").respond(500);

        var callbacks = { resolve: function () { }, reject: function () { } };

        spyOn(callbacks, "resolve");
        spyOn(callbacks, "reject");

        prematchSession.getSessionInfo().then(
            callbacks.resolve,
            callbacks.reject
        );

        $httpBackend.flush();

        expect(callbacks.resolve).not.toHaveBeenCalled();
        expect(callbacks.reject).toHaveBeenCalled();
    });
});
