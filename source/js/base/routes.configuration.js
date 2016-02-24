(function (angular) {
    "use strict";
    var rules = {
        acceptOptionalTrailingSlashRule: function ($injector, $location) {
            var path = $location.url();

            return (path[path.length - 1] !== '/' && path.indexOf('/?') === -1) ? undefined : (path.indexOf('/?') > -1) ? path.replace('/?', '?') : path.substring(0, path.length - 1);
        },

        defaultUrlRuleFactory: function (defaultPath) {

            return function ($injector, $location) {
                return ($location.url() === '/') ? defaultPath : undefined;
            };
        }
    };

    var errorLogger = function (error) {
        console.log(error);
    };

    var stateChangeHandler = function ($state, $rootScope, applicationState, preloader, catalogue, eventDataService, activeCulture, eventDataSourceManager, eventsPoller, liveCatalogueService) {
        liveCatalogueService.isActive = true;
        eventsPoller.start();

        $rootScope.$on('bets-submit-coupon-odds-changed', function () {
            eventDataSourceManager.reloadAll();
        });

        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.$broadcast("loading-main-ready");

            preloader.preload();
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log(error);

            $rootScope.$broadcast("loading-main-ready");

            if (toState.key === "event" && toState.name === "market.category.region.competition.event.page") {
                // SSK-1075 Redirect to competition when an event is removed
                $state.go("market.category.region.competition.page", {
                    market: toParams.market || "en",
                    category: toParams.category || "",
                    region: toParams.region || "",
                    competition: toParams.competition || ""
                });
                return;
            }

            $state.go("market.pagenotfound", {
                market: (!toParams.market) ? "en" : toParams.market
            });
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            var properties = [{
                "property": "market",
                "state": "culture",
                "func": function (args) {
                    return activeCulture.get(args.market);
                }
            }, {
                "property": "live",
                "func": function (args) {
                    return args.live;
                }
            }, {
                "property": "category",
                "func": catalogue.getCategory.bind(catalogue)
            }, {
                "property": "region",
                "func": catalogue.getRegion.bind(catalogue)
            }, {
                "property": "competition",
                "func": catalogue.getCompetition.bind(catalogue)
            }, {
                "property": "event",
                "func": function (args) {
                    return eventDataService.getEventFromUrlName(args.event);
                }
            }];

            var stateParameters = {
                live: _.contains(toState.name, ".live"),
                market: toParams.market,
                category: toParams.category,
                region: toParams.region,
                competition: toParams.competition,
                event: toParams.event
            };

            for (var i = 0; i < properties.length; i++) {

                var propertyName = properties[i].property;
                var stateName = (properties[i].state) ? properties[i].state : propertyName;

                if (!stateParameters[propertyName]) {
                    applicationState[stateName](null);
                } else if (stateParameters[propertyName] !== fromParams[propertyName]) {

                    var value = properties[i].func(stateParameters);
                    applicationState[stateName](value);
                }
            }

            $rootScope.$broadcast("loading-main-working");
        });
    };

    // config-time dependencies can be injected here at .provider() declaration
    angular.module("sportsbook-app").provider('runtimeStates', ["$stateProvider", function ($stateProvider) {
        // runtime dependencies for the service can be injected here, at the provider.$get() function.
        this.$get = ["$q", "$timeout", "$state", function ($q, $timeout, $state) { // for example
            return {
                addState: function (name, state) {
                    $stateProvider.state(name, state);
                }
            };
        }];
    }]);

    angular.module("sportsbook-app").config([
        "$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", "$resourceProvider", "defaultPath",
        function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $resourceProvider, defaultPath) {

            // Register rules.
            $urlRouterProvider.rule(rules.acceptOptionalTrailingSlashRule); // SSK-344 Accept optional trailing slashes
            $urlRouterProvider.rule(rules.defaultUrlRuleFactory(defaultPath));


            // Create the root state that defines the sportsbook layout
            $stateProvider.state("root", {
                "abstract": true,
                "templateUrl": "/@@sourcePath/sportsbook/views/page.html"
            });


            // Remove the hash tag
            $locationProvider.html5Mode({
                "enabled": true,
                "requireBase": false
            });


            // Disable removal of trailing slash for resource
            $resourceProvider.defaults.stripTrailingSlashes = false;


            // DISABLED TO PREVENT SENDING THE UNNECCESARY OPTIONS METHOD
            // This is used so that .Net understands that it is coming from an AJAX Request.
            // $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
        }
    ]);

    angular.module('sportsbook-app').service('stateService', ['runtimeStates', function (runtimeStates) {
        var self = this;
        var seoContentResolverFactory = function (state) {

            var functionName = (state.key === "market") ? "getSeoContentForLanguageLobby" : "getSeoContentFor" + _.capitalize(state.key) + "Lobby";

            return ["contentDataService", function (contentDataService) {
                return contentDataService[functionName]().catch(errorLogger);
            }];
        };

        var breadCrumbResolverFactory = function (state) {

            var levels = state.name.split(".");
            levels[0] = "culture";

            return [
                'breadcrumbGenerator', 'applicationState', '$q',
                function (breadcrumbGenerator, applicationState, $q) {

                    var promises = {};

                    _.forEach(levels, function (detail) {
                        if (detail === "page") {
                            return;
                        }

                        promises[detail] = applicationState[detail]();
                    });

                    return $q.all(promises).then(function (values) {
                        return breadcrumbGenerator.generate(values.culture, values.live, values.category, values.region, values.competition, values.event);
                    });
                }
            ];
        };

        var betSlipResolverFactory = function () {
            return [
                'betslip',
                function (betslip) {
                    return betslip.initialise().then(function (success) {
                        return betslip;
                    });
                }
            ];
        };

        var navigationResolverFactory = function () {
            return [
                'catalogue',
                function (catalogue) {
                    return catalogue.getMenu().catch(errorLogger);
                }
            ];
        };

        var view = function (placeHolder, controller, templateUrl, resolverFactory) {
            return {
                "placeHolder": placeHolder,
                "templateUrl": templateUrl,
                "controller": controller,
                "resolverFactory": resolverFactory
            };
        };

        var eventPageDataResolverFactory = function () {
            return [
                "viewData", "applicationState", "$q", "eventPhases",
                function (viewData, applicationState, $q, eventPhases) {
                    return $q.all({
                        "culture": applicationState.culture(),
                        "category": applicationState.category(),
                        "region": applicationState.region(),
                        "competition": applicationState.competition(),
                        "event": applicationState.event(),
                        "live": applicationState.live()
                    }).then(function (applicationStateValues) {
                        var filters = {
                            "categoryIds": [applicationStateValues.category.id],
                            "regionIds": [applicationStateValues.region.id],
                            "subCategoryIds": [applicationStateValues.competition.id],
                            "eventIds": [applicationStateValues.event.id],
                            "phase": applicationStateValues.live ? eventPhases.LIVE : eventPhases.BOTH
                        };

                        return viewData.getMarketSelectionsViewData("pageData", filters);
                    });
                }
            ];
        };

        var eventListPageResolverFactory = function (state) {
            if (state.name === "market.multiview") {
                return [
                    "viewData", "$stateParams",
                    function (viewData, $stateParams) {
                        var subCategoryIds = [].concat($stateParams.c);
                        return viewData.getMultiViewData("pageData", subCategoryIds);
                    }
                ];
            } else {
                return [
                    "viewData", "applicationState", "$q",
                    function (viewData, applicationState, $q) {
                        return $q.all({
                            live: applicationState.live(),
                            category: applicationState.category(),
                            region: applicationState.region(),
                            competition: applicationState.competition()
                        }).then(function (applicationStateValues) {
                            var filters = {
                                categoryIds: [applicationStateValues.category.id]
                            };

                            // only filter for live when live (prematch shows all)
                            if (applicationStateValues.live) {
                                filters.live = applicationStateValues.live;
                            }

                            if (applicationStateValues.region) {
                                filters.regionIds = [applicationStateValues.region.id];

                                if (applicationStateValues.competition) {
                                    filters.subCategoryIds = [applicationStateValues.competition.id];
                                }
                            }

                            return viewData.getEventListViewData("pageData", filters);
                        });
                    }
                ];
            }
        };

        var liveTableByCategoryPageResolverFactory = function () {
            return [
                "viewData", "applicationState", "$q",
                function (viewData, applicationState, $q) {
                    return $q.all({
                        category: applicationState.category(),
                        region: applicationState.region(),
                        competition: applicationState.competition()
                    }).then(function (applicationStateValues) {
                        var filters = {
                            categoryIds: [applicationStateValues.category.id]
                        };
                        if (applicationStateValues.region) {
                            filters.regionIds = [applicationStateValues.region.id];

                            if (applicationStateValues.competition) {
                                filters.subCategoryIds = [applicationStateValues.competition.id];
                            }
                        }

                        return viewData.getLiveTableByCategoryViewData("pageData", filters);
                    });
                }
            ];

        };

        var startingSoonDataResolverFactory = function () {
            return [
                "viewData", "eventSortFields",
                function (viewData, eventSortFields) {
                    return viewData.getBetgroupCompositesViewData("pageData", {
                        eventSortBy: eventSortFields.DATE,
                        eventCount: 50,
                        categoryIds:[]
                    });
                }
            ];
        };

        var searchPageResolverFactory = function () {
            return [
                "viewData", "$stateParams",
                function (viewData, $stateParams) {
                    return viewData.getSearchResultsData("pageData", $stateParams.text);
                }
            ];
        };

        var homePageResolverFactory = function () {
            return [
                "viewData",
                function (viewData) {
                    return viewData.getHomePageData("pageData");
                }
            ];
        };

        var liveLobbyPageResolverFactory = function () {
            return [
                "viewData",
                function (viewData) {
                    return viewData.getLivePageData("pageData");
                }
            ];
        };

        var views = {
            "breadcrumbs": view("breadcrumbs@root", "breadcrumbsCtrl", "/@@sourcePath/sportsbook/views/breadcrumbs.html", breadCrumbResolverFactory),
            "seoContent": view("seo-content@root", "seoCtrl", "/@@sourcePath/sportsbook/views/seo.html", seoContentResolverFactory),
            "menu": view("left-navigation@root", "navigationCtrl", "/@@sourcePath/sportsbook/views/navigation.html", navigationResolverFactory),

            "initialiseBetslip": view("bet-slip@root", "betslipCtrl", "/@@sourcePath/sportsbook/bets/bet-slip.html", betSlipResolverFactory),

            "homePage": view(null, null, null, homePageResolverFactory),
            "searchPage": view(null, null, null, searchPageResolverFactory),
            "liveLobbyPage": view(null, null, null, liveLobbyPageResolverFactory),
            "liveTableByCategoryPage": view(null, null, null, liveTableByCategoryPageResolverFactory),
            "eventListPage": view(null, null, null, eventListPageResolverFactory),
            "eventPage": view(null, null, null, eventPageDataResolverFactory),
            "startingSoonPage": view(null, null, null, startingSoonDataResolverFactory),

            "market.live": view("main-area@root", "liveLobbyCtrl", "/@@sourcePath/sportsbook/views/live-lobby.html"),
            "market.live.category.page": view("main-area@root", "livePageCtrl", "/@@sourcePath/sportsbook/views/live-page.html"),
            "market.live.category.region.page": view("main-area@root", "livePageCtrl", "/@@sourcePath/sportsbook/views/live-page.html"),
            "market.live.category.region.competition.page": view("main-area@root", "livePageCtrl", "/@@sourcePath/sportsbook/views/live-page.html"),
            "market.live.category.region.competition.event.page": view("main-area@root", "eventSectionCtrl", "/@@sourcePath/sportsbook/views/event-section-view.html"),
            "market.pagenotfound": view("main-area@root", "genericPageCtrl", "/@@sourcePath/sportsbook/views/404-page.html"),
            "market.search": view("main-area@root", "searchResultCtrl", "/@@sourcePath/sportsbook/views/search-results.html"),
            "market.multiview": view("main-area@root", "eventListCtrl", "/@@sourcePath/sportsbook/views/event-list.html"),
            "market.bethistory": view("main-area@root", "bethistoryCtrl", "/@@sourcePath/sportsbook/betHistory/bet-history.html"),
            "market.page": view("main-area@root", "mainPageCtrl", "/@@sourcePath/sportsbook/views/main-page.html"),
            "market.category.page": view("main-area@root", "eventListCtrl", "/@@sourcePath/sportsbook/views/event-list.html"),
            "market.category.region.page": view("main-area@root", "eventListCtrl", "/@@sourcePath/sportsbook/views/event-list.html"),
            "market.category.region.competition.page": view("main-area@root", "eventListCtrl", "/@@sourcePath/sportsbook/views/event-list.html"),
            "market.category.region.competition.event.page": view("main-area@root", "eventSectionCtrl", "/@@sourcePath/sportsbook/views/event-section-view.html"),
            "market.startingsoon": view("main-area@root", "startingSoonCtrl", "/@@sourcePath/sportsbook/views/starting-soon.html")
        };

        self.generate = function (node, parent) {
            if (node && node.name) {
                var state = {};
                state.name = (parent) ? parent.name + "." + node.name : node.name;
                state.url = (node.name === "page") ? "" : (node.url) ? node.url : "/:" + node.name;
                state.key = (node.name === "page") ? parent.key : node.name;
                state.resolve = {};

                if (node.hasPage) {
                    state.abstract = true;
                }

                if (!parent) {
                    state.parent = "root";
                }


                state.views = {};

                if (!state.abstract) {
                    var viewDefinition = views[state.name];

                    if (viewDefinition && viewDefinition.placeHolder) {
                        state.views[viewDefinition.placeHolder] = viewDefinition;
                    }
                }

                if (node.views) {
                    _.forEach(node.views, function (viewName) {

                        var viewDefinition = views[viewName];

                        if (viewDefinition.placeHolder) {
                            state.views[viewDefinition.placeHolder] = viewDefinition;
                        }

                        if (viewDefinition.resolverFactory) {
                            state.resolve[viewName] = viewDefinition.resolverFactory(state);
                        }
                    });
                }

                // Register the state
                runtimeStates.addState(state.name, state);

                // Process child states.
                if (node.children) {
                    _.forEach(node.children, function (child) {
                        self.generate(child, state);
                    });
                }
            }
        };
        return self;
    }]);

    // run the module and register the state change handler
    angular.module("sportsbook-app").run(["$state", "$rootScope", "$timeout", "applicationState", "preloader", "catalogue", "eventDataService", "activeCulture", "routingService", "stateService", "eventDataSourceManager", "eventsPoller", "liveCatalogue", "$urlRouter",
        function ($state, $rootScope, $timeout, applicationState, preloader, catalogue, eventDataService, activeCulture, routingService, stateService, eventDataSourceManager, eventsPoller, liveCatalogueService, $urlRouter) {
            // retrieve the routing heirarchy from file
            routingService.get({
                urlMarketCode: 'en',
                key: 'default'
            }).then(function (response) {
                if (response) {
                    stateService.generate(response);
                }
            }).then(function () {
                stateChangeHandler($state, $rootScope, applicationState, preloader, catalogue, eventDataService, activeCulture, eventDataSourceManager, eventsPoller, liveCatalogueService);
            }).then(function () {
                // SSK-1094 Obscure bug with loading event page twice
                // This is a weird workaround for the double sync() call
                // which is causing the event page data resolver to load
                // twice.
                // More info: https://github.com/christopherthielen/ui-router-extras/issues/138
                $timeout(function () {
                    if ($state.transition) {
                        $state.transition.then($urlRouter.sync, $urlRouter.sync);
                    } else {
                        $urlRouter.sync();
                    }
                });
            });
        }
    ]);

    angular.module("sportsbook-app").service('activeCulture', ["$translate", "amMoment", "cultureProvider", function ($translate, amMoment, cultureProvider) {
        this.get = function (market) {

            // Update the application state and change the culture for the translation system.
            var urlMarketCode = market;

            // Need to add it to the resolver
            $translate.use(urlMarketCode);

            // Need to add it to the resolver
            return cultureProvider.setLocale(urlMarketCode).then(function (data) {

                amMoment.changeLocale(data.cultureInfo, {
                    calendar: {
                        lastDay: '[Yesterday] LT',
                        sameDay: 'LT',
                        nextDay: '[Tomorrow] LT',
                        lastWeek: '[last] dddd LT',
                        nextWeek: 'dddd LT',
                        sameElse: 'L LT'
                    }
                });

                return data;
            });
        };
    }]);

})(angular);
