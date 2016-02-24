describe("Adapter: Scoreboard", function () {

    var d = {};

    beforeEach(module("sportsbook.markets", ["sportsbookConfigurationProvider", function (sportsbookConfigurationProvider) {
        sportsbookConfigurationProvider.config = {
            categoryMappingSource: "/js/config/category-mappings.js",
            services: {
                isaUrl: "http://www.test.com"
            }
        };
    }]));

    beforeEach(inject(["$q", "scoreboardsResource", "scoreboardsAdapter", "sportsbookConfiguration", "$httpBackend", "prematchSession", function ($q, resource, adapter, config, httpBackend, prematchSession) {
        d.q = $q;
        d.resource = resource;
        d.adapter = adapter;
        d.config = config;
        d.http = httpBackend;
        d.prematchSession = prematchSession;

    }]));

    it("should request scoreboard details from the ISA service", function () {
        var deferred = d.q.defer();

        spyOn(d.prematchSession, "getSessionInfo").and.returnValue(d.q.when({
            "segmentId": 601,
            "token": "TEST_TOKEN"
        }));

        d.http.expect("GET", d.config.services.isaUrl + "/601/en/scoreboard?eventIds=1,2,3&totalActions=0").respond([{
            "ok": true
        }]);

        spyOn(d.adapter, "toScoreboard").and.returnValue([{
            "converted": true
        }]);

        var response = d.resource.query({
            "eventIds": "1,2,3",
            "totalActions": 0
        }, {
            "languageCode": "en"
        });

        d.http.flush();

        response.then(function (response) {
            expect(response.length).toBe(1);
            expect(response[0].converted).toBe(true);

        });
        expect(d.adapter.toScoreboard).toHaveBeenCalledWith([{
            "ok": true
        }]);
    });
});
