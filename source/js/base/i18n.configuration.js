(function (angular) {
    "use strict";

    // Initialize the application.
    angular.module("sportsbook-app").config(["tmhDynamicLocaleProvider", function (tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('/angular-i18n/angular-locale_{{locale}}.js');
    }]);
})(angular);