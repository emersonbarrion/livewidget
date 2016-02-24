describe("Service: contentService", function () {
    "use strict";

    var d = {};

    beforeEach(module("sportsbook.content"));

    beforeEach(inject(["contentService", "sportsbookPage", "$q", "$rootScope", function (service, resource, $q, $rootScope) {

        d.service = service;
        d.resource = resource;
        d.$q = $q;
        d.root = $rootScope;
    }]));

    it("Should pass options to the sportsbookPage", function (done) {

        spyOn(d.resource, "get").and.callFake(function (args) {

            expect(args.language).toBe("en");
            expect(args.typeName).toBe("landingpages");
            expect(args.categoryId).toBe(4);
            expect(args.regionId).toBe(3);
            expect(args.competitionId).toBe(2);
            expect(args.eventId).toBe(1);

            return { "$promise": d.$q.when("OK") };
        });

        d.service.getPageContent({
            "market": "en",
            "categoryId": 4,
            "regionId": 3,
            "competitionId": 2,
            "eventId": 1
        }).then(function() {
            done();
        });

        d.root.$digest();
    });
});
