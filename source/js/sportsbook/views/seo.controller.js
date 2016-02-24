(function(angular) {
    'use strict';

    var SeoControllerClass = (function() {
        function SeoControllerClass($scope, $rootScope, $q, $location, seoContent) {
            var category = seoContent.category ? seoContent.category.name : "";
            var region = seoContent.region ? seoContent.region.name : "";
            var competition = seoContent.competition ? seoContent.competition.name : "";
            var event = seoContent.event ? seoContent.event.name : "";

            // retrieve the data from the resolver
            var data = seoContent.data;
            if (data) {
                $scope.htmlContent = data.htmlContent.replaceTemplateVariables(category, region, competition, event);

                $rootScope.$broadcast('common-events-update-page-meta', {
                    metaTitle: data.metaTitle.replaceTemplateVariables(category, region, competition, event),
                    metaDescription: data.metaDescription.replaceTemplateVariables(category, region, competition, event),
                    metaKeywords: data.metaKeywords.replaceTemplateVariables(category, region, competition, event),
                    canonicalUrl: data.canonicalUrl || $location.absUrl()
                });
            }
        }

        SeoControllerClass.$inject = ['$scope', '$rootScope', '$q', '$location', 'seoContent'];
        return SeoControllerClass;
    }());

    angular.module('sportsbook.views').controller('seoCtrl', SeoControllerClass);

})(window.angular);
