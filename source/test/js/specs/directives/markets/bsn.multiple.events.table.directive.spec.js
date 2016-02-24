// ReSharper disable UseOfImplicitGlobalInFunctionScope
describe('Directives: Multiple events table', function () {
    "use strict";

    var scope, parentScope, betslip = null;

    beforeEach(module('sportsbook.application'));
    beforeEach(module('sportsbook.markets'));
    beforeEach(module('sportsbook.eventsTable'));
    beforeEach(module('sportsbook.betslip'));

    beforeEach(inject(["$compile", "$rootScope", "$httpBackend", "betslip", function ($compile, $rootScope, $httpBackend, _betslip_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching

        parentScope = $rootScope.$new();
        betslip = _betslip_;

        var data = {
            events: [
            {
                id: 1,
                markets: [
                    { id: 1, lineValue: "3.20", betGroup: { id: 1 }, selections: [{ id: 1 }] },
                    { id: 2, betGroup: { id: 2 }, selections: [{ id: 2, lineValue: "2.5" }] }
                ]
            }],
            groupHeaders: [{ betGroupId: 1 }]
        };

        parentScope.$digest();

        $httpBackend.when("GET", "/templates/sportsbook/events-table/multiple-events-table.html").respond("hi");
        $compile("<div bsn-multiple-events-table='" + JSON.stringify(data) + "' bsn-competition=\"{ id: 1 }\" bsn-configuration=\"{ betGroups: [1, 2] }\" bsn-limit=\"3\"></div>")(parentScope);

        $httpBackend.flush();

        scope = parentScope.$$childHead;
    }]));

    it("should delegate add selection to service", function() {
        spyOn(betslip, "add");

        var mockSelection = {
            id: 1
        };

        scope.addToBetslip(mockSelection);
        expect(betslip.add).toHaveBeenCalledWith(mockSelection);
    });

    it("should delegate isEligible to service", function () {
        spyOn(betslip, "isEligible");

        var mockSelection = {
            id: 1
        };

        scope.isEligible(mockSelection);
        expect(betslip.isEligible).toHaveBeenCalledWith(mockSelection);
    });

    it("should delegate isInCoupon query to service", function () {
        spyOn(betslip, "isInCoupon");

        var mockSelection = {
            id: 1
        };

        scope.isInCoupon(mockSelection);
        expect(betslip.isInCoupon).toHaveBeenCalledWith(mockSelection);
    });

    it("return a count of items which are not already displayed", function(done) {

        // Event has 10 markets, with 2 of them being returned by the API for display.
        // This would mean that out of the n markets which can be displayed by the multiple event table,
        // two are populated.
        var event = {
            "marketCount": 10,
            "marketCells": [
                { "selections": [{ id: 1 }, { id: 2 }] },
                { "selections": [{ id: 3 }, { id: 4 }] }
            ]
        };

        var columnNumber = 0;
        expect(scope.getRemainingMarkets(columnNumber++, event)).toBe(9); // If only 1 column was to be displayed, we would have 9 remaining markets.
        expect(scope.getRemainingMarkets(columnNumber++, event)).toBe(8); // If two columns were to be displayed, we would have 8 remaining markets.

        // Since the 2nd market has no selections, it is not considered for the purposes of remaining markets.
        // Empty markets are used as placeholders to maintain the order of the columns. This occurs where the 
        // table configuration specifies a betgroup id which is not present in that particular event.
        var eventWithEmptySelections = {
            "marketCount": 2,
            "marketCells": [
                { "selections": [{ id: 1 }, { id: 2 }] },
                { "selections": [] },
                { "selections": [{ id: 3 }, { id: 4 }] }
            ]
        };

        columnNumber = 0;
        expect(scope.getRemainingMarkets(columnNumber++, eventWithEmptySelections)).toBe(1); // If 1 column was to be displayed, we would have 1 remaining market (2 markets - 1 being displayed).
        expect(scope.getRemainingMarkets(columnNumber++, eventWithEmptySelections)).toBe(1); // If 2 columns were to be displayed, we would still have 1 remaining market since empty ones are skipped.
        expect(scope.getRemainingMarkets(columnNumber++, eventWithEmptySelections)).toBe(0); // If 3 columns were to be displayed, we would have 0 remaining markets as both populated markets are displayed.

        var eventWithNoMarkets = {
            "marketCount": 0,
            "marketCells": [
                { "selections": [] },
                { "selections": [] },
                { "selections": [] }
            ]
        };

        columnNumber = 0;
        expect(scope.getRemainingMarkets(columnNumber++, eventWithNoMarkets)).toBe(0); // If the event has no markets, the result should always be 0.
        expect(scope.getRemainingMarkets(columnNumber++, eventWithNoMarkets)).toBe(0); 

        done();
    });

    it("should default show all state to false.", function (done) {

        
        expect(scope.showAll).toBe(false);
        done();
    });

    it("should toggle show all state", function (done) {

        expect(scope.showAll).toBe(false);
        scope.toggle();

        expect(scope.showAll).toBe(true);
        scope.toggle();

        expect(scope.showAll).toBe(false);

        done();
    });
});