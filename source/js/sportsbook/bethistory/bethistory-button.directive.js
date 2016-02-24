(function(angular) {
    "use strict";

    var module = angular.module('sportsbook.betHistory');

    /* istanbul ignore next */
    module.directive("betHistoryButton", ['sportsbookConfiguration', 'applicationState', function (sportsbookConfiguration, applicationState) {
        return {
            restrict: "E",
            templateUrl: sportsbookConfiguration.templates.betHistoryButton,
            link: function (scope) {
                applicationState.culture().then(function(culture) {
                    scope.betHistoryLink = "/" + culture.urlMarketCode + "/bethistory";
                });

                applicationState.user.subscribe(function (user) {
                    scope.showBetHistoryButton = user.isAuthenticated;
                }, true);
            }
        };
    }]);

}(window.angular));
