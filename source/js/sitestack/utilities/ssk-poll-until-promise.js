(function (angular) {
    var module = angular.module('angular-sitestack-utilities');

    var states = {
        loading: 0,
        loaded: 1
    };

    var PollUntilPromiseFactoryClass = function ($q, $timeout, functionToExecuteForPoll, dataSuccessPredicate, numberOfRetries, timeoutPerRetry) {
        this.$q = $q;
        this.$timeout = $timeout;

        this.deferred = $q.defer();

        this.result = null;

        this.functionToExecuteForPoll = functionToExecuteForPoll;
        this.dataSuccessPredicate = dataSuccessPredicate;

        this.numberOfRetries = numberOfRetries;
        this.timeoutPerRetry = timeoutPerRetry;
        
        this.state = states.loading;

        this.makePollingPromise();
    };

    PollUntilPromiseFactoryClass.prototype.makePollingPromise = function() {
        var self = this;

        self.$q.when(self.functionToExecuteForPoll()).then(
            function(result) {
                if (self.dataSuccessPredicate(result)) {
                    self.result = result;
                    self.deferred.resolve(self.result);

                    self.state = states.loaded;
                } else {
                    return self.$q.reject("Predicate failed");
                }
            },
            function (errorMessage) {
                return self.$q.reject("Message from inner promise: " + errorMessage);
            }
        ).catch(function(errorMessage) {
            if (self.numberOfRetries > 0) {
                self.numberOfRetries -= 1;

                self.$timeout(self.makePollingPromise.bind(self), self.timeoutPerRetry);
            } else {
                self.state = states.notLoaded;
                self.deferred.reject(errorMessage);
            }
        });
    };


    PollUntilPromiseFactoryClass.prototype.then = function (resolve, reject) {
        var self = this;

        if (self.isLoaded()) {

            if (resolve) {
                return self.$q.when(resolve(self.result));
            }

        } else if (self.isLoading()) {
            return self.deferred.promise.then(resolve, reject);
        }
    };

    PollUntilPromiseFactoryClass.prototype.isLoaded = function () {
        return this.state === states.loaded;
    };

    PollUntilPromiseFactoryClass.prototype.isLoading = function () {
        return this.state === states.loading;
    };

    module.factory("pollUntilPromiseFactory", ["$q", "$timeout", function ($q, $timeout) {
        return function (functionToExecuteForPoll, dataSuccessPredicate, numberOfRetries, timeoutPerRetry) {
            return new PollUntilPromiseFactoryClass($q, $timeout, functionToExecuteForPoll, dataSuccessPredicate, numberOfRetries, timeoutPerRetry);
        };
    }]);

}(window.angular));