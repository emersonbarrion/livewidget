(function(angular) {
    'use strict';

    var module = angular.module('angular-sitestack-utilities');

    module.directive('sskResize', ["$window", function($window) {
        return {
            link: function (scope, element, attrs) {
                function updateScopeValues() {
                    scope.windowHeight = $window.innerHeight;
                    scope.windowWidth = $window.innerWidth;

                    scope.isLargeScreen = scope.windowWidth > attrs.sskResize;  
                }

                $window.onresize = function () {
                    updateScopeValues();
                    scope.$digest();
                };

                updateScopeValues();
            }
        };
    }]);

}(angular));
