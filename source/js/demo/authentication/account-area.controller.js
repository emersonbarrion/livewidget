(function(angular) {
    "use strict";

    function accountAreaController($scope, $log, lodash, userService, sportsbookUserDetails) {

        /*jshint validthis: true */
        var vm = this;

        $scope.loginSubmitModel = {
            username: '',
            password: ''
        };

        $scope.userLoggedInModel = {
            firstName: sportsbookUserDetails.firstName,
            lastName: sportsbookUserDetails.lastName,
            fullName: sportsbookUserDetails.fullName
        };

        $scope.progressIndicatorVisible = false;

        $scope.responseErrorMessage = '';

        $scope.isLoggedIn = false;

        $scope.$on('user-changed', function(event, user) {
            $scope.isLoggedIn = user.isAuthenticated;
        });

        vm.login = function () {
            var username = $scope.loginSubmitModel.username;
            var password = $scope.loginSubmitModel.password;

            if (!lodash.isEmpty(username) && !lodash.isEmpty(password)) {
                $scope.progressIndicatorVisible = true;

                userService.login({ username: username, password: password }).then(function (response) {
                    $scope.isLoggedIn = response.isAuthenticated;
                    $scope.responseErrorMessage = response.messageCode;
                    $scope.progressIndicatorVisible = false;

                    $scope.userLoggedInModel = {
                        firstName: sportsbookUserDetails.firstName = response.firstName,
                        lastName: sportsbookUserDetails.lastName = response.lastName,
                        fullName: sportsbookUserDetails.fullName = response.fullName
                    };
                });
            }
        };

        $scope.logout = function () {
            $scope.progressIndicatorVisible = true;
            userService.logout().then(function () {
                $scope.isLoggedIn = false;
                $scope.progressIndicatorVisible = false;
            });
        };
    }

    angular.module("demo.authentication")
        .controller("accountAreaCtrl", ["$scope", "$log", "lodash", "userService", "sportsbookUserDetails", accountAreaController]);
})(angular);