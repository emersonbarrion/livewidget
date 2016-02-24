(function (angular) {
	"use strict";

    /* SiteStack Modules */

	/**
	 * @ngdoc overview
	 * @name angular-sitestack-modules
	 * @requires ng
	 * @description
	 * The dependencies for the different SiteStack modules.
	 */
	angular.module('angular-sitestack-modules', ['ng']);

	/**
	 * @ngdoc overview
	 * @name angular-sitestack-application
	 * @requires angular-sitestack-modules
	 * @description
	 * SiteStack AngularJS Appplication module.
	 */
    angular.module('angular-sitestack-application', ["ngResource", "angular-cache", 'angular-sitestack-modules']);

	/**
	 * @ngdoc overview
	 * @name angular-sitestack-utilities
	 * @requires angular-sitestack-modules
	 * @description
	 * SiteStack AngularJS Utilities module.
	 */
    angular.module('angular-sitestack-utilities', ["pascalprecht.translate", "angular-sitestack-application"]);

	/**
	 * @ngdoc overview
	 * @name angular-sitestack-currency
	 * @description
	 * SiteStack AngularJS Currency module.
	 */
	angular.module('angular-sitestack-currency', ["angular-sitestack-application"]);

	/**
	 * @ngdoc overview
	 * @name angular-sitestack-culture
	 * @requires ng
	 * @requires angular-cache
	 * @requires tmh.dynamicLocale
	 * @requires angular-sitestack-application
	 * @description
	 * SiteStack AngularJS Culture module.
	 */
	angular.module('angular-sitestack-culture', ['angular-cache', 'tmh.dynamicLocale', 'angular-sitestack-application']);

	/**
	 * @ngdoc overview
	 * @name angular-sitestack
	 * @requires angular-sitestack-application
	 * @requires angular-sitestack-utilities
	 * @requires angular-sitestack-currency
	 * @requires angular-sitestack-culture
	 * @description
	 * The main SiteStack AngularJS module.
	 */
	angular.module('angular-sitestack', [
        'angular-sitestack-application',
        'angular-sitestack-utilities',
        'angular-sitestack-currency',
        'angular-sitestack-culture'
	]);

}(angular));
