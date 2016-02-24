(function (angular) {
    "use strict";

    /**
     * @ngdoc directive
     * @name sportsbook.favorites.directive:favoritesButton
     * @description
     *
     *
     * @param  {object} node - The sub category node.
     * @requires sportsbook.configuration.sportsbookConfiguration
     * @requires angular-sitestack-application.applicationState
     * @requires sportsbook.favorites.favorites
     * @requires $rootScope
     * @requires $log
     */
    angular
        .module("sportsbook.favorites")
        .directive("favoritesButton", ["sportsbookConfiguration", "applicationState", "favorites", "$rootScope", "$log",
            function (sportsbookConfiguration, applicationState, favorites, $rootScope, $log) {
                return {
                    restrict: "A",
                    scope: {
                        node: "=node"
                    },
                    replace: false,
                    templateUrl: sportsbookConfiguration.templates.favoritesButton,
                    link: function(scope) {
                        scope.showFavoritesButton = false;

                        var isFavorite = function(node) {
                            // This is cached
                            return favorites.getSubCategories().then(function(response) {
                                return _.includes(response, node.id);
                            }).catch(function(e) {
                                $log.warn(e);
                                return false;
                            });
                        };

                        // triggerred when a user clicks on the favorite icon
                        scope.toggleFavorite = function(node) {
                            favorites.toggleSubCategory(!node.isFavorite, node.id).then(function(response) {
                                node.isFavorite = response;
                                $rootScope.$broadcast("favorite-toggled", node);
                            }).catch(function(e) {
                                $log.warn(e);
                            });
                        };

                        // TODO: unneccessary calls to the API because we do not persist the left navigation view model
                        // retrieve the customer favorites from the service
                        applicationState.user().then(function(user) {
                            scope.showFavoritesButton = user.isAuthenticated;
                        });

                        applicationState.user.subscribe(function(user) {
                            scope.showFavoritesButton = user.isAuthenticated;
                        }, true);

                        scope.$watch("showFavoritesButton", function(newValue, oldValue) {
                            if (Boolean(newValue)) {
                                isFavorite(scope.node).then(function(response) {
                                    scope.node.isFavorite = response;
                                    scope.isReady = true;
                                });
                            }
                        });
                    }
                };
            }
        ]);

}(window.angular));
