(function (angular) {
    "use strict";

    var NavigationHelperFactory = (function () {
        var dependencies = {};

        function NavigationHelper(menu) {
            this.flat = {};
            this.flat.prematch = this.flatten(menu);
        }

        NavigationHelper.prototype.flatten = function (menu) {
            var _ = dependencies.lodash;

            var flat = {};
            flat.categories = menu;
            flat.regions = _.flatten(_.map(flat.categories, "children"), false);
            flat.subcategories = _.flatten(_.map(flat.regions, "children"), false);
            flat.all = _.flatten(_.toArray(flat), false);

            return flat;
        };

        NavigationHelper.prototype.expand = function (item, collection) {
            var _ = dependencies.lodash;

            if (!item) {
                return;
            }

            var menuItem = _.findWhere(collection, {
                slug: item.slug
            });
            if (!menuItem) {
                return;
            }

            menuItem.isExpanded = true;
            menuItem.isSelected = true;
        };

        NavigationHelper.prototype.expandItems = function () {
            var _ = dependencies.lodash;
            var applicationState = dependencies.applicationState;

            var self = this;
            _.forEach(self.flat.prematch.all, function (item) {
                item.isSelected = item.checked;
            });

            // Expand and select items from the url.
            applicationState.competition().then(function (item) {
                self.expand(item, self.flat.prematch.subcategories);
            });
            applicationState.region().then(function (item) {
                self.expand(item, self.flat.prematch.regions);
            });
            applicationState.category().then(function (item) {
                self.expand(item, self.flat.prematch.categories);
            });
        };

        NavigationHelper.prototype.setChecks = function (competitionIds) {
            var _ = dependencies.lodash;

            if (_.isEmpty(competitionIds)) {
                return;
            }

            var ids = _.uniq(_.map([].concat(competitionIds), function (id) {
                return parseInt(id);
            }).filter(function (id) {
                return _.isNumber(id);
            }));

            var competitions = _.filter(this.flat.prematch.subcategories, function (subCategory) {
                return _.includes(ids, subCategory.id);
            });

            _.forEach(competitions, function (subCategory) {
                subCategory.isSelected = true;
                subCategory.checked = true;
                subCategory.isExpanded = true;
            });

            var regions = _.filter(this.flat.prematch.regions, function (region) {
                return _.any(competitions, function (competition) {
                    return competition.slug.startsWith(region.slug);
                });
            });

            var categoryIds = _.uniq(_.map(regions, "parentId"));

            _.forEach(regions, function (region) {
                region.isSelected = true;
                region.isExpanded = true;
            });

            _.forEach(_.filter(this.flat.prematch.categories, function (category) {
                return _.includes(categoryIds, category.id);
            }), function (category) {
                category.isSelected = true;
                category.isExpanded = true;
            });

            return competitions;
        };

        NavigationHelper.prototype.getFavorites = function (favorites) {
            var self = this;
            // retrieve the customer favorites from the service
            return favorites.getSubCategories().then(function (response) {
                // filter the competitions that are in the favorites
                var subCategories = _.filter(self.flat.prematch.subcategories, function (n) {
                    return _.includes(response, n.id);
                });

                // set the isFavorite boolean to true
                _.forEach(subCategories, function (n) {
                    n.isFavorite = true;
                });

                // only return the competition data
                return subCategories;
            });
        };

        function NavigationHelperFactory(lodash, applicationState) {
            dependencies.lodash = lodash;
            dependencies.applicationState = applicationState;
            return NavigationHelper;
        }

        NavigationHelperFactory.$inject = ["lodash", "applicationState"];

        return NavigationHelperFactory;
    }());

    function NavigationController($scope, $rootScope, $log, lodash, applicationState, NavigationHelper, menu, $state, favorites, prematchSession, liveCatalogueService) {
        var helper = new NavigationHelper(menu);
        window.navScope = $scope;
        $scope.tree = {};
        $scope.hoursAmount = null;
        $scope.phase = 0;
        $scope.mode = "prematch";

        $scope.sortModes = {
            "Default": "sortRank.defaultSortOrder",
            "Popularity": "-sortRank.popularityRank"
        };

        $scope.sortMode = $scope.sortModes.Default;

        $scope.applyDateFilter = function (hours) {
            $scope.hoursAmount = hours;
        };

        $scope.applyPhaseFilter = function (mode) {
            $scope.phase = mode;

            switch (mode) {
                case 0:
                case 1:
                    $scope.mode = "prematch";
                    liveCatalogueService.setDefaultInterval();

                    break;
                case 2:
                    $scope.mode = "live";
                    $scope.applyDateFilter(null); // disable date filtering for live tab

                    // change polling rate/interval so that it polls with more frequency
                    liveCatalogueService.setLiveInterval();

                    break;
            }
        };

        // Loads data based on the url pattern.
        $rootScope.$broadcast("loading-navigation-working");

        $scope.tree.prematch = menu;

        $scope.$on("$stateChangeSuccess", function () {
            helper.expandItems();

            // Check any parameters from the multi-view
            if ($state.params.c) {
                helper.setChecks($state.params.c);
            }
        });

        $rootScope.$broadcast("loading-navigation-ready");

        // retrieve the favorites and set the scope.data
        helper.getFavorites(favorites).then(function (response) {
            $scope.tree.favorites = response;
        }).catch(function (e) {
            $log.warn(e);
        });

        // subscribe to the user state change
        applicationState.user.subscribe(function (user) {
            if (user.isAuthenticated) {
                // get favorites upon authentication
                helper.getFavorites(favorites).then(function (response) {
                    $scope.tree.favorites = response;
                });
            } else {
                $scope.tree.favorites = [];
            }
        }, true);

        // subscribe to the user adding/removing favorites
        $scope.$on("favorite-toggled", function (event, node) {
            if (node.isFavorite) {
                // added
                // required to search for the node in the tree to maintain state
                var subCategory = _.find(helper.flat.prematch.subcategories, function (n) {
                    return n.id === node.id;
                });

                // set the isFavorite boolean to true
                subCategory.isFavorite = true;

                $scope.tree.favorites.push(node);

            } else {
                // removed
                _.remove($scope.tree.favorites, function (n) {
                    return n.id === node.id;
                });
            }
        });

    }

    NavigationController.$inject = ["$scope", "$rootScope", "$log", "lodash", "applicationState", "navigationHelper", "menu", "$state", "favorites", "prematchSession", "liveCatalogueService"];

    angular
        .module("sportsbook.views")
        .factory("navigationHelper", NavigationHelperFactory)
        .controller("navigationCtrl", NavigationController);

}(window.angular));
