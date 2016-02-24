(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.favorites");

    /**
     * @ngdoc service
     * @name sportsbook.favorites.favorites
     * @description
     * Provider for the favorites services
     *
     * In order to use the favorites service you must provide the API endpoint in
     * the sportsbookConfiguration.
     *
     * e.g. sportsbookConfiguration.services.favoritesApi = "http://srvmtphxdev03:4435/CustomerFavoritesApi/api"
     */
    module.provider("favorites", function () {

        this.$get = ["favoritesService", "prematchSession", "applicationState", "$q", function (favoritesService, prematchSession, applicationState, $q) {
            return {

                /**
                 * @ngdoc method
                 * @name sportsbook.favorites.favorites#getSubCategories
                 * @methodOf sportsbook.favorites.favorites
                 * @description
                 * Returns the logged in customer's favorites
                 *
                 * @returns {array} - The list of favorited sub categories.
                 */
                getSubCategories: function () {
                    return applicationState.user().then(function (user) {
                        if (!user.isAuthenticated) {
                            return $q.reject("favorites.getSubCategories: User is not authenticated");
                        }
                        return prematchSession.getSessionInfo().then(function (sessionInfo) {
                            return favoritesService.getSubCategories(sessionInfo.segmentId, sessionInfo.token);
                        });
                    });
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.favorites.favorites#addSubCategory
                 * @methodOf sportsbook.favorites.favorites
                 * @description
                 * Adds the selected sub category to the customer favorites
                 *
                 * @param {number} id - The sub category ID to add to the favourites list.
                 * @returns {boolean} - True if the sub category was successfully added to the favourites list.
                 */
                addSubCategory: function (id) {
                    return applicationState.user().then(function (user) {
                        if (!user.isAuthenticated) {
                            return $q.reject("favorites.addSubCategory: User is not authenticated");
                        }
                        return prematchSession.getSessionInfo().then(function (sessionInfo) {
                            return favoritesService.addSubCategory(id, sessionInfo.segmentId, sessionInfo.token);
                        });
                    });
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.favorites.favorites#removeSubCategory
                 * @methodOf sportsbook.favorites.favorites
                 * @description
                 * Removes the selected sub category to the customer favorites
                 *
                 * @param {number} id - The sub category ID to add to the favourites list.
                 * @returns {boolean} - True if the sub category was successfully removed from the favourites list.
                 */
                removeSubCategory: function (id) {
                    return applicationState.user().then(function (user) {
                        if (!user.isAuthenticated) {
                            return $q.reject("favorites.removeSubCategory: User is not authenticated");
                        }
                        return prematchSession.getSessionInfo().then(function (sessionInfo) {
                            return favoritesService.removeSubCategory(id, sessionInfo.segmentId, sessionInfo.token);
                        });
                    });
                },

                /**
                 * @ngdoc method
                 * @name sportsbook.favorites.favorites#toggleSubCategory
                 * @methodOf sportsbook.favorites.favorites
                 * @description
                 * Toggles the selected sub category to the customer favorites
                 *
                 * @param {boolean} setFavorite - Boolean value indicating whether the sub category should be added or removed from the favorites list.
                 * @param {number} id - The sub category ID to add to the favourites list.
                 * @returns {boolean} - True if the sub category was successfully added to the favorites list, False if removed from the favourites list.
                 */
                toggleSubCategory: function (setFavorite, id) {
                    return applicationState.user().then(function (user) {
                        if (!user.isAuthenticated) {
                            return $q.reject("favorites.toggleSubCategory: User is not authenticated");
                        }
                        return prematchSession.getSessionInfo().then(function (sessionInfo) {
                            return favoritesService.toggleSubCategory(setFavorite, id, sessionInfo.segmentId, sessionInfo.token);
                        });
                    });
                }
            };
        }];

    });

})(window.angular);