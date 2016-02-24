(function(angular, _) {
    "use strict";

    var ApplicationStateClass = (function () {

        var dependencies = {};

        function ApplicationStateClass($q, lodash) {

            dependencies.$q = $q;
            dependencies.lodash = lodash;

            this.states = {};

            this._registerProperty("culture");
            this._registerProperty("user");
        }
        ApplicationStateClass.$inject = ["$q", "lodash"];

        ApplicationStateClass.prototype._registerProperty = function (key) {

            var $q = dependencies.$q;

            var self = this;

            // Register the property state.
            var state = { deferred: $q.defer(), value: undefined, valuePromise: undefined, callbacks: [] };
            self.states[key] = state;

            // Create a getter/setter.
            self.constructor.prototype[key] = function (valueOrPromise) {
                return self._process(state, valueOrPromise);
            };

            self.constructor.prototype[key].subscribe = function (callback, runFirstTime) {
                if (runFirstTime && !_.isUndefined(state.value)) {
                    callback(state.value, state.value);
                }

                state.callbacks.push(callback);
            };
        };

        ApplicationStateClass.prototype._process = function(state, valueOrPromise) {

            var _ = dependencies.lodash;
            var $q = dependencies.$q;

            if (!_.isUndefined(valueOrPromise)) {
                state.valuePromise = $q.when(valueOrPromise).then(function(value) {
                    if (!_.isUndefined(value)) {
                        if (state.value !== value) {
                            _.forEach(state.callbacks, function (callback) {
                                callback(value, state.value);
                            });
                        }

                        state.value = value;

                        state.deferred.resolve(value);

                        return state.value;
                    }
                });
            }

            return (!_.isUndefined(state.valuePromise)) ? state.valuePromise : state.deferred.promise;
        };

        return ApplicationStateClass;
    }());

    /**
     * @ngdoc service
     * @name angular-sitestack-application.applicationState
     * @description Provides access to the state components used in the sportsbook hierarchy.
     * @requires $q
     * @requires lodash
     */
    angular.module('angular-sitestack-application').service("applicationState", ApplicationStateClass);
})(angular, _);
