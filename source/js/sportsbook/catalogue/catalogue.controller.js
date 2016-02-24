
(function (angular) {
    'use strict';

    angular
        .module('sportsbook.catalogue')
        .controller("catalogueController", ["$scope", "lodash", "$state", function ($scope, _, $state) {

            $scope.displayCounts = {
                'Category': false,
                'Region': 'events',
                'Competition': 'markets'
            };

            $scope.sortModes = {
                'Default': {
                    'property': 'defaultSortOrder',
                    'reverse': false
                },
                'Popularity': {
                    'property': 'popularityRank',
                    'reverse': true
                }
            };

            $scope.sortCriteria = {
                'Category': $scope.sortModes.Popularity
            };

            $scope.sortingPredicate = function (node) {
                var predicate = ($scope.sortCriteria[node.type]) ? $scope.sortCriteria[node.type] : $scope.sortModes.Default;
                return node.sortRank[predicate.property] * (predicate.reverse ? -1 : 1);
            };

            $scope.toggleExpanded = function (node, openOnly) {
                if (node.isExpanded && openOnly) {
                    return;
                }
                node.isExpanded = !node.isExpanded;
            };

            // triggered when a checkbox is selected or unselected
            $scope.toggleCheck = function (node) {
                var nodes = [];
                var nodeId = +node.id;

                // load the current data if available
                // TODO: this will be replaced by data from the resolver instead of parsing the querystring
                if ($state.params.c) {
                    if ($state.params.c.constructor === Array) {
                        _.forEach($state.params.c, function (n) {
                            nodes.push(+n);
                        });
                    } else {
                        nodes.push(+$state.params.c);
                    }
                }

                // the node will be marked as checked before reaching this state
                if (node.checked) {
                    nodes.push(nodeId);
                } else {
                    _.remove(nodes, function (n) {
                        return n === nodeId;
                    });
                }

                $state.go('market.multiview', {
                    'c': nodes
                });
            };
        }]);

}(angular));