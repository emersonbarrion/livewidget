(function (angular) {
    "use strict";

    // sportsbook modules

    /**
     * @ngdoc overview
     * @name sportsbook.models
     */
    angular.module("sportsbook.models", []);

    /**
     * @ngdoc overview
     * @name sportsbook.streams
     */
    angular.module("sportsbook.streams", []);

    /**
     * @ngdoc overview
     * @name sportsbook.configuration
     * @requires angular-sitestack-application
     * @requires angular-sitestack-culture
     * @requires angular-data.DS
     * @requires angular-data.CacheFactory
     * @requires sportsbook.translate
     * @requires sportsbook.models
     */
    angular.module("sportsbook.configuration", [
        "angular-sitestack-application",
        "angular-sitestack-culture",

        "angular-cache",

        "sportsbook.translate",
        "sportsbook.models"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.application
     */
    angular.module("sportsbook.application", [
        "ng",
        "ngResource",
        "angularMoment",

        "sportsbook.configuration"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.translate
     */
    angular.module("sportsbook.translate", [
        "ng",

        "angular-sitestack-application"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.directives
     */
    angular.module("sportsbook.directives", [
        "sportsbook.configuration"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.catalogue
     */
    angular.module("sportsbook.catalogue", [
        "ng",
        "ngResource",
        "angularMoment",

        "angular-sitestack-utilities",
        "sportsbook.session",
        "sportsbook.configuration"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.winnerList
     */
    angular.module("sportsbook.winnerList", [
        "ng",
        "ngResource",
        "angularMoment",

        "angular-sitestack-utilities",

        "sportsbook.configuration",
        "sportsbook.catalogue",
        "sportsbook.markets"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.eventsTable
     */
    angular.module("sportsbook.eventsTable", [
        "ng",
        "ngResource",
        "angularMoment",

        "angular-sitestack-utilities",

        "sportsbook.configuration",
        "sportsbook.statistics"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.markets
     */
    angular.module("sportsbook.markets", [
        "ng",
        "ngResource",
        "angularMoment",

        "angular-sitestack-utilities",
        "sportsbook.session",
        "sportsbook.configuration",
        "sportsbook.catalogue"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.betHistory
     */
    angular.module("sportsbook.betHistory", [
        "ng",
        "angularMoment",

        "angular-sitestack-modules",

        "sportsbook.models",
        "sportsbook.configuration",
        "sportsbook.session"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.search
     */
    angular.module("sportsbook.search", [
        "ng",
        "sportsbook.session",
        "sportsbook.configuration"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.bonuses
     */
    angular.module("sportsbook.bonuses", [
        "ng",
        "ngResource",
        "angularMoment",

        "angular-sitestack-application",
        "angular-sitestack-utilities",
        "angular-sitestack-culture",

        "sportsbook.configuration",
        "sportsbook.session"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.betslip
     */
    angular.module("sportsbook.betslip", [
        "ng",

        "angular-sitestack-utilities",

        "sportsbook.markets",
        "sportsbook.validations",
        "sportsbook.configuration",
        "sportsbook.application",
        "sportsbook.bonuses",
        "sportsbook.bets"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.bets
     */
    angular.module("sportsbook.bets", [
        "ng",

        "angular-sitestack-application",
        "angular-sitestack-utilities",
        "sportsbook.configuration",
        "sportsbook.session"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.multiview
     * @requires ng
     * @requires angularMoment
     * @requires angular-sitestack-utilities
     * @requires sportsbook.configuration
     * @requires sportsbook.catalogue
     * @requires sportsbook.markets
     */
    angular.module("sportsbook.multiview", ["ng", "angularMoment", "angular-sitestack-utilities", "sportsbook.configuration", "sportsbook.catalogue", "sportsbook.markets"]);

    /**
     * @ngdoc overview
     * @name sportsbook.views
     * @requires ng
     * @requires ui.router
     * @requires angularMoment
     * @requires sportsbook.favorites
     * @requires sportsbook.session
     * @requires sportsbook.content
     * @requires sportsbook.betslip
     * @requires sportsbook.winnerList
     * @requires sportsbook.search
     */
    angular.module("sportsbook.views", [
        "ng", "ui.router", "angularMoment",

        "sportsbook.favorites", "sportsbook.session", "sportsbook.content", "sportsbook.betslip", "sportsbook.winnerList", "sportsbook.search"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.session
     * @requires ng
     */
    angular.module("sportsbook.session", ["ng", "angular-sitestack-application", "sportsbook.configuration"]);

    /**
     * @ngdoc overview
     * @name sportsbook.validations
     * @requires ng
     */
    angular.module("sportsbook.validations", ["ng", "sportsbook.markets"]);

    /**
     * @ngdoc overview
     * @name sportsbook.performance
     * @requires sportsbook.markets
     */
    angular.module("sportsbook.performance", ["sportsbook.markets"]);

    /**
     * @ngdoc overview
     * @name sportsbook.content
     * @requires ng
     */
    angular.module("sportsbook.content", ["ng", "ngResource", "angular-sitestack-application"]);

    /**
     * @ndgoc overview
     * @name sportsbook.statistics
     * @requires ng
     * @requires ngResource
     * @requires angular-cache
     * @description
     * Sportsbook module for event statistics.
     */
    angular.module("sportsbook.statistics", ["ng", "ngResource", "angular-cache"]);

    /**
     * @ngdoc overview
     * @name sportsbook.favorites
     * @requires ng
     * @requires sportsbook.catalogue
     * @description
     * Sportsbook customer favourites module.
     */
    angular.module("sportsbook.favorites", [
        "ng",

        "sportsbook.session",
        "sportsbook.configuration"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook.promotions
     * @requires ng
     * @requires angular-sitestack-modules
     * @description
     * This module contains all the components that are related to sportsbook promotions.
     */
    angular.module("sportsbook.promotions", [
        "ng",

        "angular-sitestack-modules",

        "sportsbook.markets",
        "sportsbook.catalogue"
    ]);

    /**
     * @ngdoc overview
     * @name sportsbook
     *
     * @requires ng
     * @requires ngCookies
     * @requires angular-cache
     * @requires angularMoment
     * @requires ui.router
     * @requires sportsbook.application
     * @requires sportsbook.translate
     * @requires sportsbook.catalogue
     * @requires sportsbook.markets
     * @requires sportsbook.betslip
     * @requires sportsbook.bonuses
     * @requires sportsbook.bets
     * @requires sportsbook.betHistory
     * @requires sportsbook.directives
     * @requires sportsbook.search
     * @requires sportsbook.multiview
     * @requires sportsbook.views
     * @requires sportsbook.session
     * @requires sportsbook.performance
     * @requires sportsbook.winnerList
     * @requires sportsbook.eventsTable
     * @requires sportsbook.validations
     * @requires sportsbook.content
     * @requires sportsbook.statistics
     * @requires sportsbook.favorites
     * @requires angular-sitestack-application
     * @requires angular-sitestack-culture
     * @requires angular-sitestack-currency
     * @requires angular-sitestack-utilities
     *
     * @description
     * This is the main SiteStack sportsbook module.
     */
    angular.module("sportsbook", [
        // Vendor
        "ng",
        "ngCookies",
        "angular-cache",
        "angularMoment",
        "pascalprecht.translate",
        "ui.router",

        // Lobby Specific
        "sportsbook.application",
        "sportsbook.translate",
        "sportsbook.catalogue",
        "sportsbook.markets",
        "sportsbook.betslip",
        "sportsbook.bonuses",
        "sportsbook.bets",
        "sportsbook.betHistory",
        "sportsbook.directives",
        "sportsbook.search",
        "sportsbook.multiview",
        "sportsbook.views",
        "sportsbook.session",
        "sportsbook.performance",
        "sportsbook.winnerList",
        "sportsbook.eventsTable",
        "sportsbook.validations",
        "sportsbook.content",
        "sportsbook.statistics",
        "sportsbook.promotions",
        "sportsbook.favorites",
        "sportsbook.streams",

        // Other
        "angular-sitestack-application",
        "angular-sitestack-culture",
        "angular-sitestack-currency",
        "angular-sitestack-utilities"
    ]);

}(window.angular));
