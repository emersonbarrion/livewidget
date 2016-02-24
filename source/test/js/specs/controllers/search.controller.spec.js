describe("Controllers: Search", function() {

    var $controller, $state, $rootScope, $stateParams, scope;

    beforeEach(module("sportsbook.search"));

    beforeEach(inject(["$controller", "$rootScope", function (_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $state = { "go": function() {} };
        $rootScope = _$rootScope_;
        $stateParams = {};

        scope = $rootScope.$new();

        $controller("searchCtrl", {
            $scope: scope,
            $state: $state,
            $stateParams: $stateParams
        });

        scope.$digest();
    }]));

    it("Should route to market.search", function() {

        $stateParams.market = "en";
        scope.searchText = "test";

        spyOn($state, "go");

        scope.submit();

        expect($state.go).toHaveBeenCalledWith("market.search", { market: "en", text: "test" });
    });
});