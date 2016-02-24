describe("Provider: Search", function () {

    var d = {};

    beforeEach(module('sportsbook.application'));
    beforeEach(module('angular-sitestack-utilities'));
    beforeEach(module('sportsbook.search'));

    beforeEach(inject(["searchResults", "searchService", "$q", "$rootScope", "prematchSession", "sportsbookConfiguration", function (provider, searchService, $q, $rootScope, prematchSession, sportsbookConfiguration) {

        d.root = $rootScope;
        d.provider = provider;
        d.service = searchService;
        d.q = $q;
        d.prematchSession = prematchSession;
        d.sportsbookConfiguration = sportsbookConfiguration;
    }]));

    it("getSearchResults should map and return search results", function (done) {

        spyOn(d.prematchSession, "getSessionInfo").and.returnValue(d.q.when({
            "segmentId": 601,
            "token": null
        }));
        var result = d.q.defer();
        result.resolve({
            "data": [{
                "el": [],
                "pn": "name 1",
                "ci": 1
            }, {
                "el": [],
                "pn": "name 2",
                "ci": 2
            }]
        });

        spyOn(d.service, "search").and.returnValue(result.promise);

        d.provider.getSearchResults("hi").then(function (results) {

            expect(results.length).toBe(2);
            expect(results[0].categoryId).toBe(1);
            expect(results[1].categoryId).toBe(2);
            done();
        });

        d.root.$apply();
    });

    it("getSearchResults should reject if the search request fails", function (done) {
        var result = d.q.defer();
        result.reject("search error");

        spyOn(d.service, "search").and.returnValue(result.promise);

        d.provider.getSearchResults("hi").then(function () {}, function (reason) {
            expect(reason).toBe("search error");
            done();
        });

        d.root.$apply();
    });

    it("getParticipantsNames should map and return participant names", function (done) {
        var result = d.q.defer();
        result.resolve({
            "data": [{
                "el": [],
                "pn": "name 1",
                "ci": 1
            }, {
                "el": [],
                "pn": "name 2",
                "ci": 2
            }, ]
        });

        spyOn(d.service, "search").and.returnValue(result.promise);

        d.provider.getParticipantsNames("hi").then(function (results) {

            expect(results.length).toBe(2);
            expect(results[0].participantName).toBe("name 1");
            expect(results[1].participantName).toBe("name 2");
            done();
        });

        d.root.$apply();
    });

    it("getParticipantsNames should reject if the search request fails", function (done) {
        var result = d.q.defer();
        result.reject("search error");

        spyOn(d.service, "search").and.returnValue(result.promise);

        d.provider.getParticipantsNames("hi").then(function () {}, function (reason) {
            expect(reason).toBe("search error");
            done();
        });

        d.root.$apply();
    });
});
