(function(angular) {
    'use strict';

    var module = angular.module('angular-sitestack-utilities');

    var onStart = function(scope, data) {
        scope.isWaiting = true;
        scope.hasError = false;
        scope.noDismiss = false; // if true, the user cannot dismiss the dialog box

        setTimeout(function() {
            onBusy(scope);
        }, data.wait);
    };

    var onBusy = function(scope) {
        if (!scope.isWaiting) {
            return;
        }

        scope.isBusy = true;
        scope.isWaiting = false;
    };

    var onReady = function(scope) {
        scope.isWaiting = false;
        scope.isBusy = false;
    };

    var onError = function(scope, data, eventData) {
        // remove the waiting state
        scope.isWaiting = false;
        scope.isBusy = false;

        scope.hasError = true;
        scope.errorMessage = eventData.message;
        scope.noDismiss = eventData.noDismiss;

        if (eventData.retryFn) {
            scope.retryFn = function() {
                scope.hasError = false; // hide the error overlay
                eventData.retryFn(); // fire the callback function
            };
        }
    };

    var bindEvent = function(state, handler, data) {
        data.scope.$on(data.key + "-" + state, function(event, eventData) {
            handler(data.scope, data, eventData);
        });
    };

    module.directive("sskBusy", ['$compile', '$http', 'siteStackConfiguration', function($compile, $http, siteStackConfiguration) {
        return {
            restrict: "A",
            replace: false,
            scope: {},
            link: function(scope, element, attrs) {

                scope.isBusy = false;
                scope.isWaiting = false;
                scope.hasError = false;
                scope.noDismiss = false;
                // retrieve the template Html
                $http.get(siteStackConfiguration.sskBusy).then(function(response) {
                    var template = response.data;
                    element.append($compile(template)(scope));
                });
                var config = {
                    wait: (attrs.sskBusyWait) ? attrs.sskBusyWait : 1000,
                    key: attrs.sskBusy,
                    scope: scope
                };

                bindEvent("working", onStart, config);
                bindEvent("ready", onReady, config);
                bindEvent("error", onError, config);

                if (attrs.sskBusyStart) {
                    scope.$root.$broadcast(config.key + "-working");
                }
            }
        };
    }]);
}(angular));
