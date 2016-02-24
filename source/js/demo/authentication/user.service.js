(function (angular) {
    'use strict';

    var module = angular.module('demo.authentication');

    module.service('userService', ['$http', '$rootScope', 'sitestackApiConfig', "applicationState",
        function ($http, $rootScope, sitestackApiConfig, applicationState) {

        var anonymous = {
            details: undefined,
            isAuthenticated: false
        };

        var self = this;
        self.applicationState = applicationState;
        self.user = anonymous;
        var changeUser = function(user) {
            self.user = angular.extend({}, self.user, user);
            self.applicationState.user(self.user);
            $rootScope.$broadcast('user-changed', user);
        };

        self.isLoggedIn = function() {
            return sitestackApiConfig.urlFor({ path: "/user/auth" }).then(function(url) {
                return $http.get(url, { withCredentials: true }).then(function(response) {
                    return response.data;
                });
            });
        };

        self.getDetails = function() {
            return sitestackApiConfig.urlFor({ path: "/user/details" }).then(function(url) {
                return $http.get(url, { withCredentials: true }).then(function(response) {
                    return response.data;
                });
            });
        };

        self.login = function(user) {
            return sitestackApiConfig.urlFor({ path: "/user/auth/login" }).then(function(url) {
                return $http.post(url, { userName: user.username, password: user.password }, { withCredentials: true })
                    .then(function(response) {
                        var data = response.data;
                        if (data.isAuthenticated) {
                            self.getDetails().then(function(details) {
                                changeUser({
                                    isAuthenticated: true,
                                    details: details
                                });
                            });
                        }

                        return data;
                    });
            });
        };

        self.logout = function() {
            return sitestackApiConfig.urlFor({ path: "/user/auth/logout" }).then(function(url) {
                return $http.post(url, {}, { withCredentials: true }).then(function(response) {
                    changeUser(anonymous);
                    return response.data;
                });
            });
        };

        self.getBalance = function() {

            return sitestackApiConfig.urlFor({ path: "/user/details/balance" }).then(function (url) {
                return $http.get(url, { withCredentials: true }).then(function(response) {
                    return response.data;
                });
            });
        };

        self.init = function() {
            // Used to Get the details of an authenticated user if exist
            self.isLoggedIn().then(function(data) {
                if (data.isLoggedIn) {
                    self.getDetails().then(function (details) {
                        changeUser({
                            isAuthenticated: true,
                            details: details
                        });
                    });
                } else {
                    changeUser(anonymous);
                }
            });
        };
    }]);
}(angular));