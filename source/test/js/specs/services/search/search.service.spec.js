describe("Services: Search", function () {

    var service, $httpBackend;

    beforeEach(module('sportsbook.search'));

    beforeEach(inject(["searchService", "$httpBackend", "$q", "applicationState", "sportsbookConfiguration", "prematchSession", function (searchService, _$httpBackend_, $q, applicationState, sportsbookConfiguration, prematchSession) {

        service = searchService;
        $httpBackend = _$httpBackend_;

        spyOn(prematchSession, "getSessionInfo").and.returnValue($q.when({
            "segmentId": 601,
            "token": null
        }));
        applicationState.culture({
            "id": 601,
            "languageCode": "en"
        });

        sportsbookConfiguration.services.isaUrl = "http://www.test.com";
        sportsbookConfiguration.clientInterfaceIdentifier = "TEST_CUSTOMER_ID";
    }]));

    it("should send requests to the web api", function (done) {

        $httpBackend.when("GET", "http://www.test.com/601/en/search?ocb=TEST_CUSTOMER_ID&searchText=test").respond(true);

        service.search({
            text: "test"
        }).then(function (searchResult) {
            expect(searchResult.data).toBe(true);
            done();
        });

        $httpBackend.flush();
    });
});
