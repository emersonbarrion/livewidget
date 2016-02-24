(function (angular) {
    var module = angular.module('angular-sitestack-utilities');

    var states = {
        notLoaded: 0,
        loading: 1,
        loaded: 2
    };

    var LazyPromiseFactoryClass = function ($q, makePromise) {
        this.$q = $q;
        this.deferred = $q.defer();

        this.result = null;
        this.state = states.notLoaded;

        this.makePromise = makePromise;
    };


    LazyPromiseFactoryClass.prototype.then = function (resolve, reject) {
        var self = this;

        if (self.isLoaded()) {

            if (resolve) {
                return self.$q.when(resolve(self.result));
            }
        
        } else if (self.isNotLoaded()) {
            self.state = states.loading;

            self.makePromise().then(
                function(result) {
                    self.result = result;

                    self.deferred.resolve(self.result);

                    self.state = states.loaded;
                },
                function(errorMessage) {
                    self.state = states.notLoaded;
                    self.deferred.reject(errorMessage);
                }
            );

            return self.deferred.promise.then(resolve, reject);
        } else if (self.isLoading()) {
            return self.deferred.promise.then(resolve, reject);
        }
    };

    LazyPromiseFactoryClass.prototype.isLoaded = function () {
        return this.state === states.loaded;
    };

    LazyPromiseFactoryClass.prototype.isLoading = function () {
        return this.state === states.loading;
    };

    LazyPromiseFactoryClass.prototype.isNotLoaded = function () {
        return this.state === states.notLoaded;
    };

    module.factory("lazyPromiseFactory", ["$q", function($q) {
        return function(makePromise) {
            return new LazyPromiseFactoryClass($q, makePromise);
        };
    }]);

}(window.angular));