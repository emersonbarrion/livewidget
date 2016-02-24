(function (angular) {
    "use strict";

    // set up constants
    var app = angular.module("sportsbook.configuration")
        .constant("defaultPath", "/en")
        .config(["$provide", "betFilters", function ($provide, betFilters) {
            $provide.constant("betHistoryControllerConfig", {
                numberOfCoupons: 20,
                defaultFilter: betFilters.OPEN,
                daysToGoBack: 20
            });
        }]);

    /**
     * @ngdoc object
     * @name sportsbook.configuration.configurationUrlsByMarket
     * @description
     * Contains a dictionary of languageCode --> widget config URL.  "default" should be provided in case any of the languages are null or empty.
     *
     * @example
     * <pre>
     * 	angular
     * 		.module("sportsbook.configuration")
     * 	 	.constant("configurationUrlsByMarket", {
     * 		 	"default": "/source/js/config/widgets/cfg-en-widgets.js",
     * 		  	"en": "/source/js/config/widgets/cfg-en-widgets.js",
     * 		   	"sv": null
     * 		  });
     * 	</pre>
     */
    angular
        .module("sportsbook.configuration")
        .constant("configurationUrlsByMarket", {
            "default": "/templates/config/widgets/cfg-en-widgets.js",
            "en": "/templates/config/widgets/cfg-en-widgets.js",
            "sv": null
        });

})(angular);
