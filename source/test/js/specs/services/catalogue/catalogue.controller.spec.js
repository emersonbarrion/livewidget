
describe("Controllers: Catalogue", function () {

    var scope, controller;

    beforeEach(module("sportsbook.application"));
    beforeEach(module("sportsbook.views"));
    beforeEach(module("sportsbook.catalogue"));

    beforeEach(inject(["$rootScope", "$controller", "$filter", function ($rootScope, $controller, $filter) {

        scope = $rootScope.$new();
        controller = $controller;

        scope.$digest();
    }]));

    it("should toggle the open state", function () {

        controller("catalogueController", {
            $scope: scope
        });

        scope.sortMode = scope.sortModes.Default;
        scope.$digest();

        var node = {
            "isExpanded": false
        };
        scope.toggleExpanded(node, true);

        expect(node.isExpanded).toBe(true);

        scope.toggleExpanded(node, true); // If open only is true, toggle should not close the node.
        expect(node.isExpanded).toBe(true);

        scope.toggleExpanded(node, false); // If open only is false, toggle can close the node.
        expect(node.isExpanded).toBe(false);

        scope.toggleExpanded(node, false); // If open only is false, toggle can still open the node.
        expect(node.isExpanded).toBe(true);
    });
});