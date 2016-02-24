describe("Services: Application state provider", function() {

    var service, rootScope, q;

    beforeEach(module("sportsbook.configuration"));

    beforeEach(inject(["applicationState", "$rootScope", "$q", function (applicationState, $rootScope, $q) {

        service = applicationState;
        rootScope = $rootScope;

        q = $q;
    }]));

    it("should return culture if it is defined", function (done) {

        var input = {
            "countryCode": "GB",
            "cultureInfo": "en-GB",
            "currencyCode": "GBP",
            "currencySymbol": "£",
            "dateFormat": "dd/MM/yy",
            "id": 601,
            "languageCode": "en",
            "name": "English",
            "numberFormat": ".",
            "timeFormat": "HH:mm",
            "urlMarketCode": "en"
        };

        service.culture(input);

        service.culture().then(function (value) {
            expect(value).toBe(input);
            done();
        });

        rootScope.$digest();
    });

    it("should resolve culture when it is defined", function (done) {

        var input = {
            "countryCode": "GB",
            "cultureInfo": "en-GB",
            "currencyCode": "GBP",
            "currencySymbol": "£",
            "dateFormat": "dd/MM/yy",
            "id": 601,
            "languageCode": "en",
            "name": "English",
            "numberFormat": ".",
            "timeFormat": "HH:mm",
            "urlMarketCode": "en"
        };

        service.culture().then(function (value) {
            expect(value).toBe(input);
            done();
        });

        service.culture(input);
        rootScope.$digest();
    });

    it("should return category if it is defined", function (done) {
        var input = { id: 1 };

        service.category(input);
        service.category().then(function (value) {
            expect(value).toBe(input);
            done();
        });
        rootScope.$digest();
    });

    it("should resolve category when it is defined", function (done) {
        var input = { id: 1 };

        service.category().then(function (value) {
            expect(value).toBe(input);
            done();
        });

        service.category(input);
        rootScope.$digest();
    });

    it("should return region if it is defined", function (done) {
        var input = { id: 1 };

        service.region(input);
        service.region().then(function (value) {
            expect(value).toBe(input);
            done();
        });
        rootScope.$digest();
    });

    it("should resolve region when it is defined", function (done) {
        var input = { id: 1 };

        service.region().then(function (value) {
            expect(value).toBe(input);
            done();
        });

        service.region(input);
        rootScope.$digest();
    });

    it("should return competition if it is defined", function (done) {
        var input = { id: 1 };

        service.competition(input);
        service.competition().then(function (value) {
            expect(value).toBe(input);
            done();
        });
        rootScope.$digest();
    });

    it("should resolve competition when it is defined", function (done) {
        var input = { id: 1 };

        service.competition().then(function (value) {
            expect(value).toBe(input);
            done();
        });

        service.competition(input);
        rootScope.$digest();
    });

    it("should return event if it is defined", function (done) {
        var input = { id: 1 };

        service.event(input);
        service.event().then(function (value) {
            expect(value).toBe(input);
            done();
        });
        rootScope.$digest();
    });

    it("should resolve event when it is defined", function (done) {
        var input = { id: 1 };

        service.event().then(function (value) {
            expect(value).toBe(input);
            done();
        });

        service.event(input);
        rootScope.$digest();
    });

    it("should resolve events which are wrapped in a promise", function (done) {
        var input = { id: 1 };

        service.event().then(function (value) {
            expect(value).toBe(input);
            done();
        });

        service.event(q.when(input));
        rootScope.$digest();
    });

    it("should do nothing in response to failed promises", function () {
        var input = { id: 1 };

        var callbackContainer = {
            callback: function () { }
        };

        spyOn(callbackContainer, "callback");

        service.event().then(callbackContainer.callback);

        service.event(q.reject(input));
        rootScope.$digest();

        expect(callbackContainer.callback).not.toHaveBeenCalled();
    });

    it("should do nothing in response to a promise which returns undefined", function () {
        var input = { id: 1 };

        var callbackContainer = {
            callback: function () { }
        };

        spyOn(callbackContainer, "callback");

        service.event().then(callbackContainer.callback);

        service.event(q.when(void 0));
        rootScope.$digest();

        expect(callbackContainer.callback).not.toHaveBeenCalled();
    });

    it("should call the callback the first time if the proper flag has been set", function (done) {
        var input = { id: 1 };
        service.event(input);

        rootScope.$digest();

        service.event.subscribe(function (newValue, oldValue) {
            expect(oldValue).toBe(input);
            expect(newValue).toBe(input);

            done();
        }, true);
    });


    it("should not call the callback the first time if the value has not been set yet", function () {
        var callbackContainer = {
            callback: function () {}
        };

        spyOn(callbackContainer, "callback");

        service.event.subscribe(callbackContainer.callback, true);

        rootScope.$digest();

        expect(callbackContainer.callback).not.toHaveBeenCalled();
    });

    it("should allow multiple subscribers to a property", function (done) {
        var input = { id: 1 };

        service.event.subscribe(function (newValue, oldValue) {
            expect(oldValue).toBe(undefined);
            expect(newValue).toBe(input);

            done();
        });

        service.event(input);
        rootScope.$digest();
    });

    it("should activate subscriptions each time the property is updated", function (done) {
        var firstInput = { id: 1 };
        var secondInput = { id: 2 };
        var firstCall = true;

        service.event.subscribe(function (newValue, oldValue) {
            if (firstCall) {
                expect(oldValue).toBe(undefined);
                expect(newValue).toBe(firstInput);

                firstCall = false;
            } else {
                expect(oldValue).toBe(firstInput);
                expect(newValue).toBe(secondInput);

                done();
            }
        });

        service.event(firstInput);
        service.event(secondInput);
        rootScope.$digest();
    });
});