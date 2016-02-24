
(function (angular) {
    "use strict";

    angular.module('angular-sitestack-utilities').directive('sskLoader', function () {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                // Store original display mode of element
                var shownType = element.css('display');
                var onlyOnce = false;

                function hideElement() {
                    if (!onlyOnce) {
                        element.hide();
                        onlyOnce = true;
                    }
                }

                function showElement() {
                    element.show();
                }

                scope.$root.$on('$stateChangeStart', hideElement);
                scope.$root.$on('$stateChangeSuccess', showElement);
                scope.$root.$on('$stateChangeError', showElement);
            }
        };
    });

}(window.angular));