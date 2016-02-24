(function(angular) {
    "use strict";

    var module = angular.module("sportsbook.favorites");

    /**
     * @ngdoc service
     * @name sportsbook.favorites.favoritesAdapter
     */
    var FavoritesAdapterClass = function() {};

    /**
     * @ngdoc method
     * @name sportsbook.favorites.favoritesAdapter#toFavorites
     * @methodOf sportsbook.favorites.favoritesAdapter
     * @description
     * Maps the Favorites API result to an array of favorites.
     *
     * @param  {object} data - Response data from the Favorites API GET method.
     * @return {array} - A list of favorites.
     */
    FavoritesAdapterClass.prototype.toFavorites = function(data) {
        if (_.isEmpty(data) || _.isEmpty(data.favoriteSubCategories)) {
            return [];
        }
        return data.favoriteSubCategories;
    };

    module.service("favoritesAdapter", [FavoritesAdapterClass]);

})(window.angular);
