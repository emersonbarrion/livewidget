describe("Controllers: Navigation", function() {

    var root, scope, controller, helper, state;

    beforeEach(module("sportsbook.views"));

    beforeEach(inject(["$rootScope", "$controller", "navigationHelper", "applicationState", function ($rootScope, $controller, NavigationHelper, applicationState) {

        root = $rootScope;
        scope = $rootScope.$new();
        controller = $controller;
        helper = NavigationHelper;
        state = applicationState;
        scope.$digest();
    }]));

    beforeEach(function (done) {
        done();
    });

    it("Should create the model on construction", function (done) {

        scope.$on("loading-navigation-working", function () {
            expect(scope.tree.prematch).toBe(undefined);
        });

        scope.$on("loading-navigation-ready", function () {
            expect(scope.tree.prematch.length).toBe(1);
            expect(scope.tree.prematch[0].value).toBe("ok");
            done();
        });

        controller("navigationCtrl", {
            $scope: scope,
            menu: [{ "value": "ok" }]
        });
        done();
        scope.$digest();
    });

    it("should expand the specified item", function (done) {

        var collection = [
            { "slug": "/abc" },
            { "slug": "/def" },
            { "slug": "/ghi" }
        ];

        var navHelper = new helper(collection);

        navHelper.expand(collection[1], collection);

        expect(collection[1].isExpanded).toBe(true);
        expect(collection[1].isSelected).toBe(true);

        // The following conditions should fail silently.
        expect(navHelper.expand(null, collection)).toBeUndefined();                  // No item to expand
        expect(navHelper.expand({ "slug": "/xyz" }, collection)).toBeUndefined();    // item to expand not in collection

        done();
    });

    it("should expand items as determined by the applicationState", function () {

        var collection = [
            { "slug": "/abc", "children": [{ "slug": "/abc/123", "children": [{ "slug": "/abc/123/456" }] }] },
            { "slug": "/def", "children": [{ "slug": "/def/123", "children": [{ "slug": "/def/123/456" }] }] },
            { "slug": "/ghi", "children": [{ "slug": "/ghi/123", "children": [{ "slug": "/ghi/123/456" }] }] }
        ];

        var navHelper = new helper(collection);

        state.category(collection[0]);
        state.region(collection[0].children[0]);
        state.competition(collection[0].children[0].children[0]);

        navHelper.expandItems();

        root.$apply();

        expect(collection[0].isExpanded).toBe(true);
        expect(collection[0].isSelected).toBe(true);

        expect(collection[0].children[0].isExpanded).toBe(true);
        expect(collection[0].children[0].isSelected).toBe(true);

        expect(collection[0].children[0].children[0].isExpanded).toBe(true);
        expect(collection[0].children[0].children[0].isSelected).toBe(true);
    });

    it("should check and expand the competition tree", function (done) {

        var collection = [
            { "slug": "/abc", "id": 1, "children": [{ "slug": "/abc/123", "parentId": 1, "children": [{ "id": 1, "slug": "/abc/123/456" }] }] },
            { "slug": "/def", "id": 2, "children": [{ "slug": "/def/123", "parentId": 2, "children": [{ "id": 2, "slug": "/def/123/456" }] }] },
            { "slug": "/ghi", "id": 3, "children": [{ "slug": "/ghi/123", "parentId": 3, "children": [{ "id": 3, "slug": "/ghi/123/456" }] }] }
        ];

        var navHelper = new helper(collection);


        navHelper.setChecks([2]);

        expect(collection[1].isExpanded).toBe(true);
        expect(collection[1].isSelected).toBe(true);

        expect(collection[1].children[0].isExpanded).toBe(true);
        expect(collection[1].children[0].isSelected).toBe(true);

        expect(collection[1].children[0].children[0].isExpanded).toBe(true);
        expect(collection[1].children[0].children[0].isSelected).toBe(true);

        // Should return silently if no ids are given.
        expect(navHelper.setChecks()).toBeUndefined();

        done();
    });
});
