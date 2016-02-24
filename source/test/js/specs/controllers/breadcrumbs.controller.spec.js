describe("Controller: Breadcrumbs", function() {
    var scope, controller, q;

    beforeEach(module('sportsbook.application'));
    beforeEach(module("sportsbook.views"));

    beforeEach(inject(["$controller", "$rootScope", "$q", function ($controller, $rootScope, $q) {

        controller = $controller;

        scope = $rootScope.$new();

        q = $q;
    }]));

    it("Should generate an empty breadcrumb list if market is not defined", function () {
        controller("breadcrumbsCtrl", {
            $scope: scope,
            breadcrumbs: []
        });

        expect(scope.breadcrumbs.length).toBe(0);
    });

    it("Should generate breadcrumbs for market", function() {
        controller("breadcrumbsCtrl", {
            $scope: scope,
            breadcrumbs: [{ label: "Sport Betting", href: "/en" }]
        });

        expect(scope.breadcrumbs.length).toBe(1);
        expect(scope.breadcrumbs[0].label).toBe("Sport Betting");
        expect(scope.breadcrumbs[0].href).toBe("/en");
    });
    
});