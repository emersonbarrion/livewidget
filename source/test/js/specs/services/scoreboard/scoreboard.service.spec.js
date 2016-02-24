describe("Service: Scoreboard data service", function () {
    "use strict";

    var d = {};

    beforeEach(module('sportsbook.markets', ["sportsbookConfigurationProvider", function (sportsbookConfigurationProvider) {
        sportsbookConfigurationProvider.config = {
            categoryMappingSource: "/js/config/category-mappings.js",
            services: {
                isaUrl: "http://www.test.com"
            },
            clientInterfaceIdentifier: "TEST_CUSTOMER_ID"
        };
    }]));


    beforeEach(inject([
        "scoreboardsService", "scoreboardsResource", "$q", "$rootScope", "applicationState", "prematchSession", "sportsbookConfiguration",
        function (scoreboardsService, scoreboardsResource, $q, $rootScope, applicationState, prematchSession, sportsbookConfiguration) {
            d.root = $rootScope;
            d.resource = scoreboardsResource;
            d.dataService = scoreboardsService;
            d.state = applicationState;
            d.q = $q;
            d.prematchSession = prematchSession;
            d.sportsbookConfiguration = sportsbookConfiguration;
        }
    ]));

    it("should request scoreboard data", function (done) {

        spyOn(d.prematchSession, "getSessionInfo").and.returnValue(d.q.when({
            "segmentId": 601,
            "token": "TEST_TOKEN"
        }));
        d.state.culture({
            "languageCode": "en"
        });

        spyOn(d.resource, "query").and.returnValue(
            d.q.when([{
                "ok": true
            }]));


        d.dataService.byEvent({
            "eventIds": [1, 2, 3],
            "totalActions": 0
        }).then(function (data) {

            expect(data.length).toBe(1);
            expect(data[0].ok).toBe(true);
            expect(d.resource.query).toHaveBeenCalledWith({
                "eventids": "1,2,3",
                "totalActions": 0
            }, {
                "languageCode": "en"
            });

            done();
        });

        d.root.$digest();
    });
});
