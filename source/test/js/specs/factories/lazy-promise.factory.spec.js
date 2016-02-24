describe("Factory: LazyPromise", function () {

    var lazyPromiseFactory, makePromiseContainer, $rootScope, $q;

    beforeEach(module("angular-sitestack-utilities"));

    beforeEach(inject(["lazyPromiseFactory", "$rootScope", "$q", function (_lazyPromiseFactory_, _$rootScope_, _$q_) {
        lazyPromiseFactory = _lazyPromiseFactory_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        makePromiseContainer = { makePromise: function () { } };

    }]));



    function createSubscriber() {
        var subscriber = {
            resolve: function () { },
            reject: function () { },

            subscribe: function (promise) {
                promise.then(subscriber.resolve, subscriber.reject);
            }
        };

        spyOn(subscriber, "resolve");
        spyOn(subscriber, "reject");

        return subscriber;
    }

    
    
    it("should not create the promise before the first subscription is made", function () {
        spyOn(makePromiseContainer, "makePromise").and.returnValue($q.when());

        var lazyPromise = lazyPromiseFactory(makePromiseContainer.makePromise);

        expect(makePromiseContainer.makePromise).not.toHaveBeenCalled();

        lazyPromise.then();

        expect(makePromiseContainer.makePromise).toHaveBeenCalled();
    });

    it("should contact all subscribers", function () {
        spyOn(makePromiseContainer, "makePromise").and.returnValue($q.when());

        var firstSubscriber = createSubscriber();
        var secondSubscriber = createSubscriber();
        
        var lazyPromise = lazyPromiseFactory(makePromiseContainer.makePromise);

        firstSubscriber.subscribe(lazyPromise);
        secondSubscriber.subscribe(lazyPromise);

        $rootScope.$apply();
        
        expect(firstSubscriber.resolve).toHaveBeenCalled();
        expect(firstSubscriber.reject).not.toHaveBeenCalled();

        expect(secondSubscriber.resolve).toHaveBeenCalled();
        expect(secondSubscriber.reject).not.toHaveBeenCalled();

    });

    it("should call the failure subscription in the case of a rejection", function () {
        spyOn(makePromiseContainer, "makePromise").and.returnValue($q.reject());

        var subscriber = createSubscriber();

        var lazyPromise = lazyPromiseFactory(makePromiseContainer.makePromise);

        subscriber.subscribe(lazyPromise);

        $rootScope.$apply();

        expect(subscriber.resolve).not.toHaveBeenCalled();
        expect(subscriber.reject).toHaveBeenCalled();
    });

    it("should only create the promise once", function () {
        spyOn(makePromiseContainer, "makePromise").and.returnValue($q.when());

        var lazyPromise = lazyPromiseFactory(makePromiseContainer.makePromise);

        lazyPromise.then();
        lazyPromise.then();
        $rootScope.$apply();

        lazyPromise.then();

        expect(makePromiseContainer.makePromise.calls.count()).toBe(1);
    });

    it("should try to create the promise again after a failure has occured", function () {
        var makePromiseCalled = false;

        spyOn(makePromiseContainer, "makePromise").and.callFake(function () {
            if (!makePromiseCalled) {
                makePromiseCalled = true;
                return $q.reject();
            } else {
                return $q.when();
            }
        });

        var subscriber = createSubscriber();

        var lazyPromise = lazyPromiseFactory(makePromiseContainer.makePromise);

        lazyPromise.then(subscriber.resolve, subscriber.reject);
        $rootScope.$apply();

        lazyPromise.then(subscriber.resolve);
        $rootScope.$apply();

        lazyPromise.then(subscriber.resolve);

        expect(makePromiseContainer.makePromise.calls.count()).toBe(2);
        expect(subscriber.resolve.calls.count()).toBe(1);
        expect(subscriber.reject.calls.count()).toBe(1);
    });

    it("should contact subscribers even if they register after the promise has been fulfilled", function () {
        spyOn(makePromiseContainer, "makePromise").and.returnValue($q.when());

        var subscriber = createSubscriber();

        var lazyPromise = lazyPromiseFactory(makePromiseContainer.makePromise);
        subscriber.subscribe(lazyPromise);

        $rootScope.$apply();
        expect(subscriber.resolve).toHaveBeenCalled();

        subscriber.subscribe(lazyPromise);
        expect(subscriber.resolve.calls.count()).toBe(2);
    });

    it("should return a promise before the promise is made, while it is being made, and when it is finished", inject(["$timeout", function ($timeout) {
        spyOn(makePromiseContainer, "makePromise").and.returnValue($timeout(function () {}, 1000));

        var subscriber = createSubscriber();

        var lazyPromise = lazyPromiseFactory(makePromiseContainer.makePromise);

        function expectToBePromise(value) {
            expect(value.then).toBeDefined();
            expect(value.catch).toBeDefined();
            expect(value.finally).toBeDefined();
        }

        expectToBePromise(lazyPromise.then(subscriber.resolve, subscriber.reject));

        $timeout.flush();

        $rootScope.$apply();
        expectToBePromise(lazyPromise.then(subscriber.resolve, subscriber.reject));
    }]));
});