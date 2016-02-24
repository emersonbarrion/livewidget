// ReSharper disable UseOfImplicitGlobalInFunctionScope
describe('Directives: Update SEO', function () {
    "use strict";

    var $compile = null;
    var $rootScope = null;

    beforeEach(module('sportsbook.views'));

    beforeEach(inject(["$compile", "$rootScope", function (_$compile_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }]));

    beforeEach(function (done) {
        done();
    });

    it("Should update header title", function (done) {
        var element = $compile("<div seo-container></div>")($rootScope);

        $rootScope.$broadcast("common-events-update-page-meta", { metaTitle: "My Title" });

        $rootScope.$digest();

        expect(element.find('title').text()).toBe("My Title");
        done();
    });

    it("Should update descriptions", function (done) {
        var element = $compile("<div seo-container></div>")($rootScope);

        $rootScope.$broadcast("common-events-update-page-meta", { metaDescription: "My description" });

        $rootScope.$digest();

        expect(element.find('meta[name="description"]')[0].attributes.content.value).toBe("My description");
        done();
    });

    it("Should update canonical urls", function (done) {
        var element = $compile("<div seo-container></div>")($rootScope);

        $rootScope.$broadcast("common-events-update-page-meta", { canonicalUrl: "http://www.test.org" });

        $rootScope.$digest();

        expect(element.find('link[rel="canonical"]')[0].attributes.href.value).toBe("http://www.test.org");
        done();
    });

    it("Should update keywords", function (done) {
        var element = $compile("<div seo-container></div>")($rootScope);

        $rootScope.$broadcast("common-events-update-page-meta", { metaKeywords: "My keywords" });

        $rootScope.$digest();

        expect(element.find('meta[name="keywords"]')[0].attributes.content.value).toBe("My keywords");
        done();
    });
});