describe("Directive: bsn-odds", function() {
    var $compile,
        $rootScope,
        $httpBackend;

    beforeEach(module("sportsbook.directives"));

    beforeEach(inject(["$compile", "$rootScope", "$httpBackend", function (_$compile_, _$rootScope_, _$httpBackend_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        $httpBackend.when("GET", "/templates/sportsbook/directives/bsn-odds.html").respond(
            "<span class='odds-container' ng-class='{ updated: hasDifference(), more: (odds > oldOdds), less: (odds < oldOdds) }'>" +
                "<span class='odds' ng-bind='odds | number: 2'></span>" +
                "<span class='difference-indicator' ng-if='hasDifference()'></span>" +
            "</span>"
        );
    }]));

    describe("hasDifference", function() {
        it("should return true if current odds do not equal old odds.", function () {
            var scope = $rootScope.$new();
            var element = $compile(angular.element("<span bsn-odds='2.0'></span>"))(scope);
            $httpBackend.flush();
            scope.$digest();
            var directiveScope = element.children('.odds-container').scope();
            directiveScope.odds = 1.0;
            scope.$digest();
            expect(directiveScope.hasDifference()).toBe(true);
        });
    });

});
