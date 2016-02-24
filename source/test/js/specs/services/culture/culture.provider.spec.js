describe("Provider: Culture", function () {

    var provider, cultureService, $q, $rootScope, locale;

    beforeEach(module('angular-sitestack-culture'));

    beforeEach(inject(['$rootScope', '$q', 'cultureProvider', 'cultureService', 'tmhDynamicLocale', function (_$rootScope_, _$q_, _cultureProvider_, _cultureService_, tmhDynamicLocale) {
        provider = _cultureProvider_;
        cultureService = _cultureService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        locale = tmhDynamicLocale;

    }]));

    beforeEach(function (done) {
        done();
    });

    it("Should Set Locale Default Successfull", function (done) {

        var deferredCulture = $q.defer();
        deferredCulture.resolve(undefined);
        spyOn(cultureService, "getCulture").and.returnValue(deferredCulture.promise);

        var deferredSet = $q.defer();
        deferredSet.resolve({});
        spyOn(locale, "set").and.returnValue(deferredSet.promise);

        provider.setLocale('en').then(function (result) {
            expect(cultureService.getCulture).toHaveBeenCalledWith("en");
            expect(locale.set).toHaveBeenCalledWith("en-GB");
            done();
        });

        $rootScope.$digest();
    });

    it("Should Set Locale Default Successfull When Culture-Info is undefined", function (done) {

        var deferredCulture = $q.defer();
        deferredCulture.resolve({});
        spyOn(cultureService, "getCulture").and.returnValue(deferredCulture.promise);

        var deferredSet = $q.defer();
        deferredSet.resolve({});
        spyOn(locale, "set").and.returnValue(deferredSet.promise);

        provider.setLocale('en').then(function (result) {
            expect(cultureService.getCulture).toHaveBeenCalledWith("en");
            expect(locale.set).toHaveBeenCalledWith("en-GB");
            done();
        });

        $rootScope.$digest();
    });

    it("Should Set Locale Successfull", function (done) {

        var testCulture = {
            "cultureInfo": "en-GB"
        };

        var deferredCulture = $q.defer();
        deferredCulture.resolve(testCulture);
        spyOn(cultureService, "getCulture").and.returnValue(deferredCulture.promise);

        var deferredSet = $q.defer();
        deferredSet.resolve({});
        spyOn(locale, "set").and.returnValue(deferredSet.promise);

        provider.setLocale('en').then(function (result) {
            expect(cultureService.getCulture).toHaveBeenCalledWith("en");
            expect(locale.set).toHaveBeenCalledWith("en-GB");
            expect(result.cultureInfo).toBe("en-GB");
            done();
        });

        $rootScope.$digest();
    });

    it("Should Set Angular Locale Fail and default to English", function (done) {

        var testCulture = {
            "cultureInfo": "sv-SV"
        };

        var deferredCulture = $q.defer();
        deferredCulture.resolve(testCulture);
        spyOn(cultureService, "getCulture").and.returnValue(deferredCulture.promise);

        spyOn(locale, 'set').and.callFake(function(param) {
            var deferredSet = $q.defer();
            if (param === 'sv-SV') {
                deferredSet.reject({});
            } else {
                deferredSet.resolve({});
            }
            return deferredSet.promise;
        });

        provider.setLocale('sv').then(function (result) {
            expect(cultureService.getCulture).toHaveBeenCalledWith("sv");
            expect(locale.set).toHaveBeenCalledWith("sv-SV");
            expect(locale.set).toHaveBeenCalledWith("en-GB");
            expect(result.cultureInfo).toBe("sv-SV");
            done();
        });

        $rootScope.$digest();
    });

});