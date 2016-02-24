(function(angular) {
    'use strict';

    var module = angular.module('sportsbook.promotions');

    /**
     * @ngdoc directive
     * @name sportsbook.promotions.directive:marketPromotion
     * @requires $compile
     * @requires sportsbook.betslip.betslip
     * @requires sportsbook.promotions.marketPromotion
     * @requires angular-sitestack-application.applicationState
     * @requires sportsbook.sportsbookConfiguration
     */
    module.directive("marketPromotion", ["$compile", "betslip", "marketPromotion", "applicationState", "sportsbookConfiguration",
        function ($compile, betslip, marketPromotion, applicationState, sportsbookConfiguration) {

            return {
                restrict: "A",
                replace: false,
                scope: {
                    area: "=marketPromotion"
                },
                link: function(scope, element, attrs) {

                    var loadBanner = function () {
                        marketPromotion.get(scope.area).then(function (banner) {
                            if (!banner) {
                                return;
                            }
                            scope.banner = banner;
                            element.empty();
                            switch (banner.type) {
                                case "ImageBanner":
                                    element.append($compile("<div ng-include=\"'" + sportsbookConfiguration.templates.marketPromotion + "'\"></div>")(scope));
                                    break;
                                default:
                                    if (banner.img) {
                                        element.append($compile("<div class=\"promotion\" style=\"background-image:url({{banner.img}})\"><a href=\"{{banner.url}}\">" + banner.content + "</a></div>")(scope));
                                    }
                                    break;
                            }
                        });
                    };

                    scope.addToBetslip = function(selection) {
                        /// <summary>Adds an event to the coupon.</summary>
                        /// <summary>The coupon is persisted after modification.</summary>
                        /// <param name="event">The event to bet on.</param>
                        /// <param name="market">The market for the selection.</param>
                        /// <param name="selection">The selection being bet on.</param>

                        // Notify that the betslip controller that an event wants to be added to the betslip.
                        betslip.add(selection);
                    };

                    scope.isInCoupon = function(selection) {
                        return betslip.isInCoupon(selection);
                    };

                    scope.isEligible = function(selection) {
                        return betslip.isEligible(selection);
                    };

                    scope.$on("marketPromotionEvents-added", function (event, newEvents) {
                        marketPromotion.mergeEventData(scope.banner, newEvents[0]);
                    });

                    scope.$on("marketPromotionEvents-deleted", function (event, removedEventIds) {
                        scope.banner.url = scope.banner.meta.competition.slug;
                        delete scope.banner.meta.event;
                    });

                    scope.$on("marketPromotionEvents-markets-updated", function (event, eventDiffs) {
                        // Update the odds
                    });

                    applicationState.user.subscribe(function (user) {
                        loadBanner();
                    }, true);
                }
            };
        }
    ]);

}(window.angular));
