describe("Directive: Screen Resize", function () {

    var scope, $rootScope, $compile, $window;

    beforeEach(module("angular-sitestack-utilities"));

    beforeEach(inject(["$rootScope", "$compile", "$window", function(_$rootScope_, _$compile_, _$window_) {
        
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $window = _$window_;

        scope = $rootScope.$new();
        
        $compile("<div ssk-resize=\"1000\"></div>")(scope);
        scope.$digest();
    }]));

    it("should notify the root scope if the screen width is greater than the stated value.", function () {

        $window.innerWidth = 800;
        $window.innerHeight = 600;
        $window.onresize();
        expect(scope.isLargeScreen).toBe(false);

        $window.innerWidth = 1024;
        $window.innerHeight = 768;
        $window.onresize();
        expect(scope.isLargeScreen).toBe(true);
    });
});