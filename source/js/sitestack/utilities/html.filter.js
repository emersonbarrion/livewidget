(function(angular) {
    "use strict";

    angular.module('angular-sitestack-utilities')
        .filter('html', [
            '$sce', function($sce) {
                return function(val) {
                    return $sce.trustAsHtml(val);
                };
            }
        ]);
})(angular);
