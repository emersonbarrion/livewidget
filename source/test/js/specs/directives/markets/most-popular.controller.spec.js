
describe("Controller: Popular events", function () {
    "use strict";

    var controllerName = "popularEventsController";
    var d = {};
    var testEvents, testCatalogue;

    beforeEach(module("sportsbook.application"));
    beforeEach(module("sportsbook.markets"));
    beforeEach(module("sportsbook.eventsTable"));
    beforeEach(module("sportsbook.betslip"));
    beforeEach(module("sportsbook.catalogue"));

    beforeEach(inject(["$rootScope", "$controller", "$q", "$httpBackend", "applicationState", "widgetConfigurations", "eventDataSourceManager", "catalogue", "eventTableViewModelAdapterByCategory", function ($rootScope, $controller, $q, $httpBackend, applicationState, widgetConfigurations, eventDataSourceManager, catalogue, eventTableViewModelAdapterByCategory) {

        // Retain dependencies
        d.rootScope = $rootScope;
        d.controller = $controller;
        d.q = $q;
        d.httpBackend = $httpBackend;

        applicationState.culture({
            "id": 601,
            "languageCode": "en"
        });

        spyOn(widgetConfigurations, "getForCategory").and.returnValue($q.when({
            "betGroups": [1, 2, 3]
        }));

        spyOn(widgetConfigurations, "getBetGroupsForMultipleEventTables").and.returnValue($q.when([1, 2, 3]));

        spyOn(eventDataSourceManager, "createGenericEventListDataSource").and.callFake(function () {
            return $q.when({
                content: testEvents
            });
        });

        spyOn(catalogue, "getMenu").and.callFake(function () {
            return $q.when(testCatalogue);
        });;

        spyOn(eventTableViewModelAdapterByCategory, "toViewModel").and.callFake(function (x) {
            return $q.when(x);
        });

        testEvents = [{
            "id": 1
        }, {
            "id": 2
        }, {
            "id": 3
        }];

        testCatalogue = [{
            "id": 1
        }, {
            "id": 2
        }, {
            "id": 3
        }, {
            "id": 4
        }];

    }]));

    it("should request events for one or more categories if category ids are specified", function (done) {

        // Create a fresh scope.
        var scope = d.rootScope.$new();

        // Set the scope variables. These would normally be provided by the directive.
        scope.categoryIds = [1, 2, 4];
        scope.limit = 5;

        // Initialize the controller
        d.controller(controllerName, {
            "$scope": scope
        });

        scope.$digest();

        expect(scope.hasMultipleCategories).toBe(true);
        expect(scope.currentCategory).toBe(testCatalogue[0]);
        expect(scope.data[0].id).toBe(1);
        expect(scope.data[1].id).toBe(2);
        expect(scope.data[2].id).toBe(3);

        done();
    });

    it("should exit silently if none of the specified category ids are available", function (done) {

        testCatalogue = [{
            "id": 5
        }, {
            "id": 6
        }, {
            "id": 7
        }, {
            "id": 4
        }];

        // Create a fresh scope.
        var scope = d.rootScope.$new();

        // Set the scope variables. These would normally be provided by the directive.
        scope.categoryIds = [1, 2, 3];
        scope.limit = 5;

        // Initialize the controller
        d.controller(controllerName, {
            "$scope": scope
        });

        scope.$digest();

        expect(scope.hasMultipleCategories).toBe(false);
        expect(scope.currentCategory).toBeUndefined();
        expect(scope.data).toEqual([]);

        done();
    });

    it("should take the most popular categories as defined in the catalogue if no category IDs are given.", function (done) {

        testCatalogue = [{
            "id": 1,
            "eventCount": 3,
            "sortRank": {
                "popularityRank": 10
            }
        }, {
            "id": 2,
            "eventCount": 1,
            "sortRank": {
                "popularityRank": 20
            }
        }, {
            "id": 3,
            "eventCount": 0,
            "sortRank": {
                "popularityRank": 10
            }
        }, {
            "id": 4,
            "eventCount": 2,
            "sortRank": {
                "popularityRank": 9
            }
        }];

        // Create a fresh scope.
        var scope = d.rootScope.$new();

        // Set the scope variables. These would normally be provided by the directive.
        scope.categoryLimit = 3;
        scope.limit = 5;

        // Initialize the controller
        d.controller(controllerName, {
            "$scope": scope
        });

        scope.$digest();

        expect(scope.hasMultipleCategories).toBe(true);
        expect(scope.currentCategory).toEqual(testCatalogue[3]); // The results should be ordered by popularity rank.
        expect(scope.categories.length).toBe(3); // The number of categories should be capped to categoryLimit.
        expect(scope.categories[0]).toEqual(testCatalogue[3]);
        expect(scope.categories[1]).toEqual(testCatalogue[0]);
        expect(scope.categories[2]).toEqual(testCatalogue[1]); // id 3 should not be considered as it has 0 events.

        done();
    });
});
