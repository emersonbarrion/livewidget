(function (angular) {
    "use strict";

    /**
     * @ngdoc service
     * @name sportsbook.favorites.favoritesService
     * @description
     * favorites service to be consumed by the favoritesProvider
     *
     * In order to use the favorites service you must provide the API endpoint in
     * the sportsbookConfiguration.
     *
     * e.g. sportsbookConfiguration.services.favoritesApi = "http://srvmtphxdev03:4435/CustomerFavoritesApi/api"
     *
     * @requires $http
     * @requires sportsbook.configuration.apiConfig
     * @requires angular-cache.CacheFactory
     * @requires sportsbook.favorites.favoritesAdapter
     * @requires $q
     * @requires $rootScope
     */
    angular
        .module("sportsbook.favorites")
        .service("favoritesService", ["$http", "apiConfig", "CacheFactory", "favoritesAdapter", "$q", "$rootScope", "applicationState",
            function ($http, apiConfig, CacheFactory, favoritesAdapter, $q, $rootScope, applicationState) {

                var self = this;

                // cache keys
                var CACHE_KEY = "favoriteSubCategories";
                this.cache = CacheFactory.get("ssk.cache.sb.user-settings");

                // used to stop requests if the user changes state
                this.cancellation = $q.defer();

                /* istanbul ignore next */
                $rootScope.$on("$stateChangeStart", function () {
                    self.cancellation.resolve();
                    self.cancellation = $q.defer();
                });

                // Clear the stored favorites if the user logs out
                applicationState.user.subscribe(function (user) {
                    if (!user.isAuthenticated) {
                        self.invalidateCache();
                    }
                });

                /////////////////////////////////////////////////////////////////

                /**
                 * @ngdoc method
                 * @name sportsbook.favorites.favoritesService#invalidateCache
                 * @methodOf sportsbook.favorites.favoritesService
                 * @description
                 * Cleared the cached favorites list.
                 *
                 * @return {boolean} - True if the cached object was cleared, False if it was not found.
                 */
                this.invalidateCache = function () {
                    /* istanbul ignore next */
                    if (_.isEmpty(this.cache)) {
                        return false;
                    }
                    this.cache.remove(CACHE_KEY);
                    return true;
                };

                /**
                 * @ngdoc method
                 * @name sportsbook.favorites.favoritesService#getSubCategories
                 * @methodOf sportsbook.favorites.favoritesService
                 * @description
                 * Returns the logged in customer's favorites as a list of IDs.
                 *
                 * @param {(number|string)} segmentId - Current sportsbook segment ID.
                 * @param {string} token - Current sportsbook session token.
                 * @returns {array} - The list of favorited sub category IDs.
                 */
                this.getSubCategories = function (segmentId, token) {
                    // cache the retrieved data
                    var cachedFavorites = this.cache.get(CACHE_KEY);
                    if (cachedFavorites) {
                        return $q.when(cachedFavorites);
                    }

                    // retrieve the data from the api
                    return apiConfig.favoritesUrlFor({
                        path: "/favoritesubcategories"
                    }).then(function (url) {
                        return $http({
                            method: "GET",
                            params: {
                                segmentId: segmentId,
                                sessionId: token
                            },
                            url: url,
                            cache: false,
                            timeout: self.cancellation
                        }).then(function (response) {
                            // converts the data using an adapter
                            var mapped = favoritesAdapter.toFavorites(response.data);
                            // stores the mapped data in the cache
                            self.cache.put(CACHE_KEY, mapped);
                            return mapped;
                        });
                    });
                };

                /**
                 * @ngdoc method
                 * @name sportsbook.favorites.favoritesService#addSubCategory
                 * @methodOf sportsbook.favorites.favoritesService
                 * @description
                 * Adds the selected sub category to the customer favorites
                 *
                 * @param {number} id - The sub category ID to add to the favourites list.
                 * @param {(number|string)} segmentId - Current sportsbook segment ID.
                 * @param {string} token - Current sportsbook session token.
                 * @returns {boolean} - True if the sub category was successfully added to the favourites list.
                 */
                this.addSubCategory = function (id, segmentId, token) {
                    id = Number(id);
                    if (_.isNaN(id)) {
                        return $q.reject("favoritesService.addSubCategory: 'id' is not a valid sub category ID");
                    }

                    // retrieve the data from the api
                    return apiConfig.favoritesUrlFor({
                        path: "/favoritesubcategories/" + id
                    }).then(function (url) {
                        return $http({
                            method: "PUT",
                            dataType: "json",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json"
                            },
                            data: {
                                segmentId: segmentId,
                                sessionId: token,
                                subCategoryId: id
                            },
                            url: url,
                            cache: false,
                            timeout: self.cancellation
                        }).then(function (response) {
                            self.invalidateCache();
                            return true;
                        });
                    });

                };

                /**
                 * @ngdoc method
                 * @name sportsbook.favorites.favoritesService#removeSubCategory
                 * @methodOf sportsbook.favorites.favoritesService
                 * @description
                 * Removes the selected sub category to the customer favorites
                 *
                 * @param {number} id - The sub category ID to add to the favourites list.
                 * @param {(number|string)} segmentId - Current sportsbook segment ID.
                 * @param {string} token - Current sportsbook session token.
                 * @returns {boolean} - True if the sub category was successfully removed from the favourites list.
                 */
                this.removeSubCategory = function (id, segmentId, token) {
                    id = Number(id);
                    if (_.isNaN(id)) {
                        return $q.reject("favoritesService.removeSubCategory: 'id' is not a valid sub category ID");
                    }

                    // retrieve the data from the api
                    return apiConfig.favoritesUrlFor({
                        path: "/favoritesubcategories/" + id
                    }).then(function (url) {
                        return $http({
                            method: "DELETE",
                            dataType: "json",
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json"
                            },
                            data: {
                                segmentId: segmentId,
                                sessionId: token,
                                subCategoryId: id
                            },
                            url: url,
                            cache: false,
                            timeout: self.cancellation
                        }).then(function (response) {
                            self.invalidateCache();
                            return true;
                        });
                    });
                };

                /**
                 * @ngdoc method
                 * @name sportsbook.favorites.favoritesService#toggleSubCategory
                 * @methodOf sportsbook.favorites.favoritesService
                 * @description
                 * Toggles the selected sub category to the customer favorites
                 *
                 * @param {boolean} setFavorite - Boolean value indicating whether the sub category should be added or removed from the favorites list.
                 * @param {number} id - The sub category ID to add to the favourites list.
                 * @param {(number|string)} segmentId - Current sportsbook segment ID.
                 * @param {string} token - Current sportsbook session token.
                 * @returns {boolean} - True if the sub category was successfully added to the favorites list, False if removed from the favourites list.
                 */
                this.toggleSubCategory = function (setFavorite, id, segmentId, token) {
                    if (setFavorite) {
                        // add
                        return this.addSubCategory(id, segmentId, token).then(function (response) {
                            return true;
                        });
                    } else {
                        // remove
                        return this.removeSubCategory(id, segmentId, token).then(function (response) {
                            return false;
                        });
                    }
                };

            }
        ]);

})(window.angular);