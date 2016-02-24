(function (angular) {
	"use strict";

	var module = angular.module("sportsbook.promotions");

	/**
     * @ngdoc service
     * @name sportsbook.promotions.marketPromotion
     * @description Provider for the Market Promotion services
     */
	module.provider("marketPromotion", function () {

		this.$get = ["marketPromotionService", function (marketPromotionService) {
			return {

				/**
                 * @ngdoc method
                 * @name get
                 * @methodOf sportsbook.promotions.marketPromotion
                 * @description
                 * Returns the promotion for the requested area.
                 *
                 * @param {string} area - The key of the promotion area to retrieve.
				 * @return {Promise} - Promise that returns the a view model for the banner.
                 */
				get: function (area) {
					return marketPromotionService.get(area);
				},

				/**
				 * @ngdoc method
                 * @name mergeEventData
                 * @methodOf sportsbook.promotions.marketPromotion
                 * @description
                 * Returns the promotion for the requested area.
                 *
				 * @param  {object} viewModel - The view model to merge the new event data into.
				 * @param  {EventModel} eventModel - The event model which is to be merged.
				 * @return {Promise} - Promise that returns the new view mdel.
				 */
				mergeEventData: function (viewModel, eventModel) {
					return marketPromotionService.mergeEventData(viewModel, eventModel);
				}

			};
		}];
	});

})(window.angular);
