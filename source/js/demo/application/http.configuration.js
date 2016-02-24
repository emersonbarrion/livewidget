(function(angular) {
    /// <summary>Configures the default HTTP interceptors for the application.</summary>
    "use strict";
    
    var app = angular.module("sportsbook-app");
    
    app.config(["$httpProvider", function ($httpProvider) {
        
        // Error interceptor
        $httpProvider.interceptors.push(["$q", function($q) {
            return {
                'responseError': function (rejection) {

                    console.log("HTTP ERROR [" + rejection.status + "] - " + rejection.config.url);
                    return $q.reject(rejection);
                }
            };
        }]);
    }]);    
})(angular);