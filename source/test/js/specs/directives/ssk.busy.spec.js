// ReSharper disable UseOfImplicitGlobalInFunctionScope
describe('Directives: Loader (SSK-421)', function () {
    "use strict";

    var $compile, $rootScope, $httpBackend, scope, element = null;

    beforeEach(module('angular-sitestack-utilities'));

    beforeEach(inject(["$compile", "$rootScope", "$httpBackend", function (_$compile_, _$rootScope_, _$httpBackend_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;

    }]));

    beforeEach(function () {
        $httpBackend.when("GET", "/templates/sitestack/utilities/ssk-busy.html").respond("<div class='component overlay loader' ng-class=\"{ 'waiting': isWaiting, 'busy': isBusy }\" ng-show='isBusy || isWaiting'></div><div class=\"component overlay error\" ng-show=\"hasError\"><span ng-bind-html=\" errormessage| translate | html \"></span><input type=\"button\" value=\"retry\" /></div><div style=\"background: #f00;\"></div>");
        element = $compile("<div ssk-busy=\"test\" ssk-busy-wait=\"10\"><span class=\"content\">content</span></div>")($rootScope);
        $httpBackend.flush();

        scope = angular.element(element.children(".loader")[0]).scope();
    });
    
    beforeEach(function(done) {
        done();
    });
    
    it("should default all states to false", function (done) {

        expect(scope.isBusy).toBe(false);
        expect(scope.isWaiting).toBe(false);
        expect(scope.hasError).toBe(false);

        done();
    });

    it("should add loader element", function (done) {
        var loaderNode = element.children(".component.overlay.loader");
        expect(loaderNode.length).toBe(1);
        expect(loaderNode[0].localName).toBe("div");
        done();
    });

    it("should add error element", function (done) {
        var errorNode = element.children(".component.overlay.error");
        expect(errorNode.length).toBe(1);
        expect(errorNode[0].localName).toBe("div");
        done();
    });

    it("should NOT replace element content", function (done) {

        var contentNode = element.children(".content");
        expect(contentNode.length).toBe(1);
        expect(contentNode[0].localName).toBe("span");
        done();
    });

    it("should set waiting state in response to event", function(done) {

        $rootScope.$broadcast("test-working");
        expect(scope.isWaiting).toBe(true);
        done();
    });

    it("should set reset error state in response to event", function (done) {

        scope.hasError = true;
        scope.$digest();

        $rootScope.$broadcast("test-working");
        expect(scope.hasError).toBe(false);
        done();
    });

    it("should NOT set the busy state immediately", function (done) {

        $rootScope.$broadcast("test-working");
        expect(scope.isBusy).toBe(false);
        done();
    });

    it("should set the busy state after the delay elapses", function (done) {

        $rootScope.$broadcast("test-working");
        expect(scope.isBusy).toBe(false);

        setTimeout(function () {
            expect(scope.isBusy).toBe(true);
            expect(scope.isWaiting).toBe(false);
            done();
        }, 10);        
    });

    it("should reset the busy and waiting states on event", function (done) {

        $rootScope.$broadcast("test-working");
        $rootScope.$broadcast("test-ready");

        expect(scope.isBusy).toBe(false);
        expect(scope.isWaiting).toBe(false);           

        done();
    });

    describe("Multiple loader instances should coexist: ", function() {
        var secondElement = null;
        var secondScope = null;

        beforeEach(function () {
            secondElement = $compile("<div ssk-busy=\"other\"><span class=\"content\">content</span></div>")($rootScope);
            $httpBackend.flush();
            secondScope = angular.element(secondElement.children(".loader")[0]).scope();
        });

        it("separate events should not affect the loader", function (done) {

            // Trigger the second directive. The first directive should not be affected.
            $rootScope.$broadcast("other-working");
            expect(scope.isWaiting).toBe(false);
            expect(secondScope.isWaiting).toBe(true);
            
            done();
        });
    });

    describe("Multiple loader instances pointed to the same event should coexist", function () {
        var secondElement = null;
        var secondScope = null;

        beforeEach(function () {
            secondElement = $compile("<div ssk-busy=\"test\" ssk-busy-wait=\"100\"><span class=\"content\">content</span></div>")($rootScope);
            $httpBackend.flush();
            secondScope = angular.element(secondElement.children(".loader")[0]).scope();
        });

        it("an event should affect all loaders bound to it", function (done) {

            // Trigger the second directive. The first directive should not be affected.
            $rootScope.$broadcast("test-working");
            expect(scope.isWaiting).toBe(true);
            expect(secondScope.isWaiting).toBe(true);

            done();
        });
    });

    describe("Should raise busy event if requested", function () {

        it("Loader should raise busy event if set to start in busy state.", function (done) {

            scope.$on("test-working", function () {
                expect(true).toBe(true); // Expectation to silence jasmine warning about the test having no expectations. In reality done() is enough to know the test has been called.
                done();
            });
            
            $compile("<div ssk-busy=\"test\" ssk-busy-start=\"true\"><span class=\"content\">content</span></div>")($rootScope);            
        });
    });

    describe("Should handle error event", function () {

        it("Loader should handle error event.", function (done) {

            $rootScope.$broadcast("test-working");
            expect(scope.isWaiting).toBe(true);

            $rootScope.$broadcast("test-error", { message: "oops!"});
            expect(scope.hasError).toBe(true);
            expect(scope.errorMessage).toBe("oops!");

            done();
        });
    });
});