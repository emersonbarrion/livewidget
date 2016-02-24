describe("Service: Event data service", function () {
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
        "eventDataService", "eventsResource", "$q", "$rootScope", "applicationState", "prematchSession", "sportsbookConfiguration",
        function (eventDataService, eventsResource, $q, $rootScope, applicationState, prematchSession, sportsbookConfiguration) {
            d.root = $rootScope;
            d.resource = eventsResource;
            d.dataService = eventDataService;
            d.state = applicationState;
            d.q = $q;
            d.prematchSession = prematchSession;
            d.sportsbookConfiguration = sportsbookConfiguration;
        }
    ]));

    it("getEventFromUrlName should load event data based on the event name", function (done) {

        // Set up the application state
        d.state.category({
            "id": 1
        });
        d.state.region({
            "id": 2
        });
        d.state.competition({
            "id": 3
        });
        d.state.culture({
            "languageCode": "en"
        });

        spyOn(d.prematchSession, "getSessionInfo").and.returnValue(d.q.when({
            "segmentId": 601,
            "token": "TEST_TOKEN"
        }));
        // Simulate the service call return value.
        spyOn(d.resource, "query").and.returnValue(
            d.q.when([{
                "id": 4,
                "shortName": "test"
            }]));

        d.dataService.getEventFromUrlName("test").then(function (result) {
            expect(result.id).toBe(4);
            expect(d.resource.query).toHaveBeenCalledWith({
                categoryIds: 1,
                regionIds: 2,
                subCategoryIds: 3,
                exclude: 'markets'
            }, {
                languageCode: 'en'
            }, true);

            done();
        });

        d.root.$apply();
    });

    it("getEventFromUrlName should return an event with id 0 if the lookup did not return a result", function (done) {

        // Set up the application state
        d.state.category({
            "id": 1
        });
        d.state.region({
            "id": 2
        });
        d.state.competition({
            "id": 3
        });
        d.state.culture({
            "languageCode": "en"
        });

        spyOn(d.prematchSession, "getSessionInfo").and.returnValue(d.q.when({
            "segmentId": 601,
            "token": "TEST_TOKEN"
        }));

        // Mock the service call
        spyOn(d.resource, "query").and.returnValue(d.q.when([]));

        d.dataService.getEventFromUrlName("test").catch(function (result) {
            expect(result).toEqual({
                "id": 0,
                "errorCode": 404
            });
            expect(d.resource.query).toHaveBeenCalledWith({
                categoryIds: 1,
                regionIds: 2,
                subCategoryIds: 3,
                exclude: 'markets'
            }, {
                languageCode: 'en'
            }, true);

            done();
        });

        d.root.$apply();
    });
});
