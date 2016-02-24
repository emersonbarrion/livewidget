(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.session');

    module.service('userRegistration', ['sportsbookConfiguration', '$http', 'applicationState', 'prematchSession', function (configuration, $http, applicationState, prematchSession) {
        var self = this;

        applicationState.user.subscribe(function () {
            prematchSession.invalidateCache();
        });
    }]);

}(window.angular));
