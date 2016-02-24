describe("Factory: Poll Until Promise", function () {

    var pollUntilPromiseFactory, $timeout, $rootScope, $q;

    beforeEach(module("angular-sitestack-utilities"));

    beforeEach(inject(["pollUntilPromiseFactory", "$rootScope", "$timeout", "$q", function (_pollUntilPromiseFactory_, _$rootScope_, _$timeout_, _$q_) {
        pollUntilPromiseFactory = _pollUntilPromiseFactory_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $q = _$q_;
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

    it("should call the provided function and return it's result.", function (done) {

        var pollUntilPromise = pollUntilPromiseFactory(function () { return "ok"; }, function () { return true; }, 0, 0);

        pollUntilPromise.then(function(result) {
            expect(result).toBe("ok");
            done();
        });

        $rootScope.$apply();
    });

    it("should use the provided filter to evaluate the result of the function.", function() {
        var filterContainer = {
            filter: function() { return false; }
        };

        spyOn(filterContainer, "filter");

        var pollUntilPromise = pollUntilPromiseFactory(function () { return "ok"; }, filterContainer.filter, 0, 0);

        $rootScope.$apply();

        expect(filterContainer.filter).toHaveBeenCalledWith("ok");
    });

    it("should retry.", function () {
        var firstPoll = true;

        var pollUntilPromise = pollUntilPromiseFactory(function () { }, function () {
            if (firstPoll) {
                firstPoll = false;
                return false;
            } else {
                return true;
            }
        }, 1, 0);

        var subscriber = createSubscriber();

        subscriber.subscribe(pollUntilPromise);

        expect(subscriber.resolve).not.toHaveBeenCalled();
        expect(subscriber.reject).not.toHaveBeenCalled();
        
        $timeout.flush();

        expect(subscriber.resolve).toHaveBeenCalled();
        expect(subscriber.reject).not.toHaveBeenCalled();

    });

    it("should only reject once the number of retries are exhausted.", function () {
        var pollUntilPromise = pollUntilPromiseFactory(function () { }, function () { return false; }, 1, 0);

        var subscriber = createSubscriber();

        subscriber.subscribe(pollUntilPromise);

        expect(subscriber.resolve).not.toHaveBeenCalled();
        expect(subscriber.reject).not.toHaveBeenCalled();

        $timeout.flush();

        expect(subscriber.resolve).not.toHaveBeenCalled();
        expect(subscriber.reject).toHaveBeenCalled();
    });

    it("should cache the result.", function () {
        var callbacks = {
            resolve: function (result) { expect(result).toBe("ok"); },
            poll: function() { return "ok";  }
        };

        spyOn(callbacks, "resolve");
        spyOn(callbacks, "poll");

        var pollUntilPromise = pollUntilPromiseFactory(callbacks.poll, function () { return true; }, 1, 0);

        pollUntilPromise.then(callbacks.resolve);

        $rootScope.$apply();
        
        pollUntilPromise.then(callbacks.resolve);

        $rootScope.$apply();

        expect(callbacks.poll.calls.count()).toBe(1);
        expect(callbacks.resolve.calls.count()).toBe(2);
    });

    it("should also handle results which are promises.", function (done) {

        var pollUntilPromise = pollUntilPromiseFactory(function () { return $timeout(function() { return "ok"; }, 0); }, function () { return true; }, 0, 0);

        pollUntilPromise.then(function (result) {
            expect(result).toBe("ok");
            done();
        });

        $timeout.flush();
    });

    it("should always return a promise.", function () {
        var subscriber = createSubscriber();
        var firstPoll = true;

        var pollUntilPromise = pollUntilPromiseFactory(function () { }, function () {
            if (firstPoll) {
                firstPoll = false;
                return false;
            } else {
                return true;
            }
        }, 1, 0);

        function expectToBePromise(value) {
            expect(value.then).toBeDefined();
            expect(value.catch).toBeDefined();
            expect(value.finally).toBeDefined();
        }

        expectToBePromise(pollUntilPromise.then(subscriber.resolve, subscriber.reject));

        $timeout.flush();

        expectToBePromise(pollUntilPromise.then(subscriber.resolve, subscriber.reject));
    });
});