(function(angular) {
    'use strict';

    function accountAreaDirective() {
        return {
            replace: true,
            controller: "accountAreaCtrl",
            controllerAs: "accountArea",
            restrict: "E",
            templateUrl: "/templates/demo/authentication/account-area.html"
        };
    }

    angular.module("demo.authentication")
        .directive("accountArea", accountAreaDirective);
})(angular);
