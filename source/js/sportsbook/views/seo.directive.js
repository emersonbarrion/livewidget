(function(angular) {
    'use strict';

    var module = angular.module('sportsbook.views');

    module.directive('seoContainer', ["$compile", function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.children("title").remove();
                element.children("meta").remove();
                element.children("link[rel='canonical']").remove();

                scope.metaTitle = '';
                scope.metaDescription = '';
                scope.metaKeywords = '';
                scope.canonicalUrl = '';

                element.append($compile("<title>{{metaTitle}}</title><meta name='description' content='{{metaDescription}}' /><meta name='keywords' content='{{metaKeywords}}' /><link rel='canonical' href='{{canonicalUrl}}'></link>")(scope));

                scope.$on('common-events-update-page-meta', function (event, args) {
                    scope.metaTitle = args.metaTitle;
                    scope.metaDescription = args.metaDescription;
                    scope.metaKeywords = args.metaKeywords;
                    scope.canonicalUrl = args.canonicalUrl;
                });
            }
        };
    }]);

})(window.angular);
