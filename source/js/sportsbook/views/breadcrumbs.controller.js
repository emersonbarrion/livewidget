(function (angular) {
    'use strict';

    var module = angular.module('sportsbook.views');

    module.controller('breadcrumbsCtrl', ['$scope', 'breadcrumbs', function ($scope, breadcrumbs) {
        $scope.breadcrumbs = breadcrumbs;
    }]);

    module.factory('breadcrumbGenerator', function () {
        return {
            generate: function (culture, live, category, region, competition, event) {
                var breadcrumbs = [];

                var addCrumb = function (node) {
                    breadcrumbs.push({
                        label: node.name,
                        href: node.slug
                    });
                };

                if (culture) {
                    addCrumb({
                        name: "Sport Betting",
                        slug: "/" + culture.urlMarketCode
                    });
                }

                if (live) {
                    addCrumb({
                        name: "Live",
                        slug: "/" + culture.urlMarketCode + "/live"
                    });
                }

                if (category) {
                    addCrumb(category);
                }

                if (region) {
                    addCrumb(region);
                }

                if (competition) {
                    addCrumb(competition);
                }

                if (event) {
                    addCrumb(event);
                }

                return breadcrumbs;
            }
        };
    });

})(angular);
