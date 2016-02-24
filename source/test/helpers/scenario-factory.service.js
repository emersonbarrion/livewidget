(function (angular) {
    var module = angular.module("sportsbook.tests");

    function ScenarioFactory($rootScope, $httpBackend, viewData, sportsbookConfiguration, eventDataSourceManager,
                             testUrlBuilder, initialTestMarket, mockApiResponseFactory, cacheFactory,
                             testLocalStorageCouponFactory, betslip) {
        this.$rootScope = $rootScope;
        this.$httpBackend = $httpBackend;
        this.viewData = viewData;
        this.sportsbookConfiguration = sportsbookConfiguration;
        this.eventDataSourceManager = eventDataSourceManager;
        this.testUrlBuilder = testUrlBuilder;
        this.initialTestMarket = initialTestMarket;
        this.mockApiResponseFactory = mockApiResponseFactory;
        this.cacheFactory = cacheFactory;
        this.testLocalStorageCouponFactory = testLocalStorageCouponFactory;
        this.betslip = betslip;
    }

    ScenarioFactory.$inject = ["$rootScope", "$httpBackend", "viewData", "sportsbookConfiguration",
        "eventDataSourceManager", "testUrlBuilder", "initialTestMarket", "mockApiResponseFactory", "CacheFactory",
        "testLocalStorageCouponFactory", "betslip"];

    ScenarioFactory.prototype._configureCategoryTree = function () {
        this.$httpBackend.whenGET(this.testUrlBuilder.getSportsbookCategoryApiUrl(
            this.initialTestMarket.id,
            this.initialTestMarket.languageCode, {
                eventPhase: 0,
                ocb: this.sportsbookConfiguration.clientInterfaceIdentifier
            })).respond([
            this.mockApiResponseFactory.getCategory(),
            this.mockApiResponseFactory.getCategory({
                "ci": 11,
                "rl": [
                    this.mockApiResponseFactory.getRegion({
                        "ri": 22,
                        "scl": [
                            this.mockApiResponseFactory.getSubCategory({
                                "sci": 222
                            })
                        ]
                    })
                ]
            })
        ]);
    };

    ScenarioFactory.prototype.runLiveTablePageDataInitialisationScenario = function (options) {

        var self = this;
        var viewDataSet;

        // GIVEN THAT the api category tree is configured
        self._configureCategoryTree();

        // AND THAT the api event list is in a particular state
        self.$httpBackend
            .whenGET(
                self.testUrlBuilder.getSportsbookEventApiUrl(
                    self.initialTestMarket.id,
                    self.initialTestMarket.languageCode,
                    options.givenRequest
                )
            ).respond({
            "el": options.givenBackendState
        });

        // AND a brand developer retrieves the overview data
        self.viewData.getLiveTableByCategoryViewData("pageData", options.givenFilters).then(function (dataSet) {
            viewDataSet = dataSet;
        }).catch(function (error) {
            console.error(error);
        });

        self.$httpBackend.flush();

        // THEN the viewmodel should be
        options.thenViewmodel(viewDataSet);
    };

    ScenarioFactory.prototype.runMultiViewDataInitialisationScenario = function (options) {
        var self = this;

        self._runPrematchLiveAndWinnerListPageInitialisationScenario(
            function () {
                return self.viewData.getMultiViewData("pageData", options.givenCompetitionIds);
            },
            options
        );
    };

    ScenarioFactory.prototype.runLiveOverviewInitialisationScenario = function (options) {

        var self = this;
        var viewDataSet;

        // GIVEN THAT the api category tree is configured
        self._configureCategoryTree();

        // AND THAT the api event list is in a particular state
        self.$httpBackend
            .whenGET(self.testUrlBuilder.getSportsbookEventApiUrl(
                self.initialTestMarket.id,
                self.initialTestMarket.languageCode, {
                    betGroupIds: [257, 2141, 507, 2137, 2148, 649, 2433, 2434, 2435, 650],
                    categoryIds: [1, 11],
                    eventCount: 100,
                    eventPhase: 2,
                    eventSortBy: 1,
                    include: "scoreboard",
                    onlyEvenLineMarkets: true,
                    ocb: this.sportsbookConfiguration.clientInterfaceIdentifier
                })).respond({
            "el": options.givenBackendState
        });

        // AND a brand developer retrieves the overview data
        self.viewData.getLivePageData("pageData").then(function (dataSet) {
            viewDataSet = dataSet;
        }).catch(function (error) {
            console.error(error);
        });

        self.$httpBackend.flush();

        // THEN the viewmodel should be
        options.thenViewmodel(viewDataSet);
    };

    ScenarioFactory.prototype.runLiveOverviewDataUpdateScenario = function (options) {

        var $scope, mockRequest;

        var self = this;
        var viewDataSet;

        // GIVEN THAT the api category tree is configured
        self._configureCategoryTree();

        // AND THAT the api event list is in a particular state
        mockRequest = self.$httpBackend
            .whenGET(self.testUrlBuilder.getSportsbookEventApiUrl(
                self.initialTestMarket.id,
                self.initialTestMarket.languageCode, {
                    betGroupIds: [257, 2141, 507, 2137, 2148, 649, 2433, 2434, 2435, 650],
                    categoryIds: [1, 11],
                    eventCount: 100,
                    eventPhase: 2,
                    eventSortBy: 1,
                    include: "scoreboard",
                    onlyEvenLineMarkets: true,
                    ocb: this.sportsbookConfiguration.clientInterfaceIdentifier
                })).respond({
                "el": options.givenInitialBackendState
            });

        // AND a brand developer retrieves the overview data
        self.viewData.getLivePageData("pageData").then(function (dataSet) {
            // AND THAT the data set is registered to listen for changes
            viewDataSet = dataSet;
            $scope = self.$rootScope.$new();
            viewDataSet.registerDataSourceListeners($scope);

            // WHEN the event is updated in the backend
            mockRequest.respond({
                "el": options.whenBackendUpdatedTo
            });

            // AND it is polled
            self.eventDataSourceManager.reloadAll();
        }).catch(function (error) {
            console.error(error);
        });

        self.$httpBackend.flush();

        // THEN the viewmodel is updated to
        return options.thenViewmodelUpdated(viewDataSet);
    };

    ScenarioFactory.prototype.runSearchDataInitialisationScenario = function (options) {
        var self = this;
        var dataSet;

        // GIVEN THAT the api category tree is configured

        self.$httpBackend.when("GET", self.testUrlBuilder.getSportsbookSearchApiUrl(
            self.initialTestMarket.id,
            self.initialTestMarket.languageCode, {
                searchText: options.givenSearchTerm,
                ocb: this.sportsbookConfiguration.clientInterfaceIdentifier

            }
        )).respond(
            options.givenSearchResults
        );

        var results = self._runPrematchLiveAndWinnerListPageSetup(options);

        var mockWinnerListRequest = results.mockWinnerListRequest;
        var mockPrematchRequest = results.mockPrematchRequest;
        var mockLiveRequest = results.mockLiveRequest;


        // AND a brand developer retrieves the overview data

        self.viewData.getSearchResultsData("pageData", options.givenSearchTerm).then(function (dataSet) {
            // AND THAT the data set is registered to listen for changes
            viewDataSet = dataSet;
        }).catch(function (error) {
            console.error(error);
        });

        self.$httpBackend.flush();

        // THEN the viewmodel is 
        return options.thenViewmodel(viewDataSet);
    };

    ScenarioFactory.prototype.runSearchDataUpdateScenario = function (options) {
        var defaultOptions = {
            whenPrematchBackendUpdatedTo: [],
            whenLiveBackendUpdatedTo: [],
            whenWinnerListBackendUpdatedTo: []
        };

        options = _.defaults(options, defaultOptions);

        var $scope;

        var self = this;
        var dataSet;

        // GIVEN THAT the api category tree is configured
        self.$httpBackend.when("GET", self.testUrlBuilder.getSportsbookSearchApiUrl(
            self.initialTestMarket.id,
            self.initialTestMarket.languageCode, {
                searchText: options.givenSearchTerm,
                ocb: this.sportsbookConfiguration.clientInterfaceIdentifier
            }
        )).respond(
            options.givenSearchResults
        );

        var results = self._runPrematchLiveAndWinnerListPageSetup(options);

        var mockWinnerListRequest = results.mockWinnerListRequest;
        var mockPrematchRequest = results.mockPrematchRequest;
        var mockLiveRequest = results.mockLiveRequest;


        // AND a brand developer retrieves the overview data

        self.viewData.getSearchResultsData("pageData", options.givenSearchTerm).then(function (dataSet) {
            // AND THAT the data set is registered to listen for changes
            viewDataSet = dataSet;
            $scope = self.$rootScope.$new();
            viewDataSet.registerDataSourceListeners($scope);

            // WHEN the event is updated in the backend
            mockPrematchRequest.respond({
                "el": options.whenPrematchBackendUpdatedTo
            });

            mockLiveRequest.respond({
                "el": options.whenLiveBackendUpdatedTo
            });

            mockWinnerListRequest.respond({
                "el": options.whenWinnerListBackendUpdatedTo
            });

            // AND it is polled
            self.eventDataSourceManager.reloadAll();
        }).catch(function (error) {
            console.error(error);
        });

        self.$httpBackend.flush();

        // THEN the viewmodel is updated to
        return options.thenViewmodelUpdated(viewDataSet);
    };

    ScenarioFactory.prototype._runPrematchLiveAndWinnerListPageSetup = function (options) {

        var defaultOptions = {
            givenInitialWinnerListBackendState: [],
            givenInitialPrematchBackendState: [],
            givenInitialLiveBackendState: [],
        };

        options = _.defaults(options, defaultOptions);

        var $scope, mockRequest;

        var self = this;
        var viewDataSet;

        // GIVEN THAT the api category tree is configured
        self._configureCategoryTree();

        // AND THAT the api event list is in a particular state
        var mockWinnerListRequest = self.$httpBackend
            .whenGET(self.testUrlBuilder.getSportsbookEventApiUrl(
                self.initialTestMarket.id,
                self.initialTestMarket.languageCode,
                options.givenWinnerListRequest
            )).respond({
                "el": options.givenInitialWinnerListBackendState
            });

        var mockPrematchRequest = self.$httpBackend
            .whenGET(self.testUrlBuilder.getSportsbookEventApiUrl(
                self.initialTestMarket.id,
                self.initialTestMarket.languageCode,
                options.givenPrematchRequest
            )).respond({
                "el": options.givenInitialPrematchBackendState
            });

        var mockLiveRequest = self.$httpBackend
            .whenGET(self.testUrlBuilder.getSportsbookEventApiUrl(
                self.initialTestMarket.id,
                self.initialTestMarket.languageCode,
                options.givenLiveRequest
            )).respond({
                "el": options.givenInitialLiveBackendState
            });

        return {
            mockWinnerListRequest: mockWinnerListRequest,
            mockPrematchRequest: mockPrematchRequest,
            mockLiveRequest: mockLiveRequest
        };
    };

    ScenarioFactory.prototype._runPrematchLiveAndWinnerListPageInitialisationScenario = function (initialDataSetPromiseFactory, options) {
        var self = this;

        //Given that the initial setup is performed.
        var results = self._runPrematchLiveAndWinnerListPageSetup(options);

        // AND a brand developer retrieves the data
        initialDataSetPromiseFactory().then(function (dataSet) {
            options.thenViewmodel(dataSet);
        });

        self.$httpBackend.flush();
    };


    ScenarioFactory.prototype._runPrematchLiveAndWinnerListPageUpdateScenario = function (initialDataSetPromiseFactory, options) {
        var self = this;

        //Given that the initial setup is performed.
        var results = self._runPrematchLiveAndWinnerListPageSetup(options);

        var mockWinnerListRequest = results.mockWinnerListRequest;
        var mockPrematchRequest = results.mockPrematchRequest;
        var mockLiveRequest = results.mockLiveRequest;

        var defaultOptions = {
            whenWinnerListBackendUpdatedTo: [],
            whenPrematchBackendUpdatedTo: [],
            whenLiveBackendUpdatedTo: []
        };

        options = _.defaults(options, defaultOptions);

        // AND a brand developer retrieves the overview data

        initialDataSetPromiseFactory().then(function (dataSet) {
            // AND THAT the data set is registered to listen for changes
            viewDataSet = dataSet;
            $scope = self.$rootScope.$new();
            viewDataSet.registerDataSourceListeners($scope);

            // WHEN the event is updated in the backend
            mockWinnerListRequest.respond({
                "el": options.whenWinnerListBackendUpdatedTo
            });

            mockPrematchRequest.respond({
                "el": options.whenPrematchBackendUpdatedTo
            });

            mockLiveRequest.respond({
                "el": options.whenLiveBackendUpdatedTo
            });

            // AND it is polled
            self.eventDataSourceManager.reloadAll();

        }).catch(function (error) {
            console.error(error);
        });

        self.$httpBackend.flush();

        // THEN the viewmodel is updated to
        return options.thenViewmodelUpdated(viewDataSet);
    };

    ScenarioFactory.prototype.runMarketSelectionsInitialisationScenario = function (options) {

        var self = this;
        var viewDataSet;

        //Infer request from filters
        var request = _.merge({}, options.givenFilters);
        delete request.live;

        var anyPhase = !_.isUndefined(options.givenFilters.phase) && options.givenFilters.phase === 0;

        request.eventPhase = (anyPhase) ? 0 : (options.givenFilters.live) ? 2 : 1;
        request.eventSortBy = options.givenFilters.eventSortBy || 1;
        request.onlyEvenLineMarkets = options.givenFilters.onlyEvenLineMarkets || false;

        if (options.givenFilters.live || anyPhase) {
            request.include = "scoreboard";
        }

        // GIVEN THAT the api category tree is configured
        self._configureCategoryTree();

        // AND THAT the api event list is in a particular state
        self.$httpBackend
            .whenGET(self.testUrlBuilder.getSportsbookEventApiUrl(
                self.initialTestMarket.id,
                self.initialTestMarket.languageCode,
                request
            )).respond({
            "el": options.givenInitialBackendState
        });

        // AND a brand developer retrieves the overview data

        self.viewData.getMarketSelectionsViewData("pageData", options.givenFilters).then(function (dataSet) {
            viewDataSet = dataSet;
        }).catch(function (error) {
            console.error(error);
        });

        self.$httpBackend.flush();

        // THEN the viewmodel is updated to
        return options.thenViewmodelUpdated(viewDataSet);
    };

    ScenarioFactory.prototype.runEventListPageDataUpdateScenario = function (options) {
        var self = this;

        self._runPrematchLiveAndWinnerListPageUpdateScenario(
            function () {
                return self.viewData.getEventListViewData("pageData", options.givenFilters);
            },
            options
        );
    };

    ScenarioFactory.prototype.runEventListPageDataInitialisationScenario = function (options) {
        var self = this;

        self._runPrematchLiveAndWinnerListPageInitialisationScenario(
            function () {
                return self.viewData.getEventListViewData("pageData", options.givenFilters);
            },
            options
        );
    };

    ScenarioFactory.prototype._runStartingSoonSetup = function (options) {
        var self = this;

        return self.$httpBackend.whenGET(self.testUrlBuilder.getSportsbookEventApiUrl(
            self.initialTestMarket.id,
            self.initialTestMarket.languageCode,
            options.givenStartingSoonRequest
        )).respond({
            "el": options.givenInitialStartingSoonBackendState
        });
    };

    ScenarioFactory.prototype.runHomePageDataUpdateScenario = function (options) {
        var self = this;

        var defaultOptions = {
            givenInitialStartingSoonBackendState: []
        };

        options = _.defaults(options, defaultOptions);

        var mockStartingSoonRequest = self._runStartingSoonSetup(options);

        self._runPrematchLiveAndWinnerListPageUpdateScenario(
            function () {
                return self.viewData.getHomePageData("pageData");
            },
            options
        );
    };

    ScenarioFactory.prototype.runHomePageDataInitialisationScenario = function (options) {
        var self = this;

        var defaultOptions = {
            givenInitialStartingSoonBackendState: []
        };

        options = _.defaults(options, defaultOptions);

        var mockStartingSoonRequest = self._runStartingSoonSetup(options);

        self._runPrematchLiveAndWinnerListPageInitialisationScenario(
            function () {
                return self.viewData.getHomePageData("pageData");
            },
            options
        );
    };

    ScenarioFactory.prototype.runBetslipInitialisationScenario = function (options) {
        var self = this;

        // GIVEN THAT the api category tree is configured
        self._configureCategoryTree();

        // AND THAT a coupon is present in the local storage
        var userSettingsCache = self.cacheFactory.get(self.sportsbookConfiguration.cachePrefix + ".cache.sb.user-settings");
        userSettingsCache.put("coupon", options.givenCouponInLocalStorage);

        // AND THAT the api event list is in a particular state
        var eventRequest = self.$httpBackend
            .whenGET(self.testUrlBuilder.getSportsbookEventApiUrl(
                self.initialTestMarket.id,
                self.initialTestMarket.languageCode,
                self.testLocalStorageCouponFactory.convertLocalStorageCouponToEventRequest(
                    options.givenCouponInLocalStorage
                )
            )).respond({
                "el": options.givenBackendState
            });

        // AND a brand developer retrieves the overview data
        self.betslip.initialise();

        self.$httpBackend.flush();
        // THEN the betslip service
        return options.thenBetslip(self.betslip);
    };

    ScenarioFactory.prototype.runStartingSoonUpdateScenario = function (options) {
        var self = this;

        // GIVEN THAT the api category tree is configured
        self._configureCategoryTree();

        var mockedRequest = self._runStartingSoonSetup(options);

        self.$httpBackend
            .whenGET(self.testUrlBuilder.getStartingSoonPageConfigUrl(self.initialTestMarket.urlMarketCode))
            .respond({
                "betGroupIds": [1, 27],
                "categoryIds": [],
                "limit": 3,
                "compositeColumns": [{
                    "header": "Match Winner",
                    "possibleBetGroupIds": [1, 27],
                    "columns": [{
                        "header": "1",
                        "selectionsOrderingByBetGroupId": {
                            "1": 1,
                            "27": 1
                        },
                        "isLine": false
                    }, {
                        "header": "X",
                        "selectionsOrderingByBetGroupId": {
                            "1": 2,
                            "27": null
                        },
                        "isLine": false
                    }, {
                        "header": "2",
                        "selectionsOrderingByBetGroupId": {
                            "1": 3,
                            "27": 2
                        },
                        "isLine": false
                    }]
                }, {
                    "header": "Number of Goals",
                    "possibleBetGroupIds": [5],
                    "columns": [{
                        "header": "Line",
                        "selectionsOrderingByBetGroupId": null,
                        "isLine": true
                    }, {
                        "header": "Over",
                        "selectionsOrderingByBetGroupId": {
                            "5": 1
                        },
                        "isLine": false
                    }, {
                        "header": "Under",
                        "selectionsOrderingByBetGroupId": {
                            "5": 2
                        },
                        "isLine": false
                    }]
                }]
            });

        self.viewData.getBetgroupCompositesViewData("pageData", {
            eventSortBy: 2,
            eventCount: 3,
            eventPhase: 1,
            categoryIds: []
        }).then(function (data) {
            mockedRequest.respond({
                "el": options.givenMarketsWereUpdated
            });

            $scope = self.$rootScope.$new();
            data.registerDataSourceListeners($scope);

            return self.eventDataSourceManager.reloadAll().then(function () {
                options.thenViewmodel(data._viewModelProperties[0].viewModel);
            });
        });

        self.$httpBackend.flush();
    };

    ScenarioFactory.prototype.runStartingSoonFilterScenario = function (options) {
        var self = this;

        // GIVEN THAT the api category tree is configured
        self._configureCategoryTree();

        var mockedRequest = self._runStartingSoonSetup(options);

        self.$httpBackend
            .whenGET(self.testUrlBuilder.getStartingSoonPageConfigUrl(self.initialTestMarket.urlMarketCode))
            .respond({
                "betGroupIds": [1, 27],
                "categoryIds": [],
                "limit": 3,
                "compositeColumns": [{
                    "header": "Match Winner",
                    "possibleBetGroupIds": [1, 27],
                    "columns": [{
                        "header": "1",
                        "selectionsOrderingByBetGroupId": {
                            "1": 1,
                            "27": 1
                        },
                        "isLine": false
                    }, {
                        "header": "X",
                        "selectionsOrderingByBetGroupId": {
                            "1": 2,
                            "27": null
                        },
                        "isLine": false
                    }, {
                        "header": "2",
                        "selectionsOrderingByBetGroupId": {
                            "1": 3,
                            "27": 2
                        },
                        "isLine": false
                    }]
                }, {
                    "header": "Number of Goals",
                    "possibleBetGroupIds": [5],
                    "columns": [{
                        "header": "Line",
                        "selectionsOrderingByBetGroupId": null,
                        "isLine": true
                    }, {
                        "header": "Over",
                        "selectionsOrderingByBetGroupId": {
                            "5": 1
                        },
                        "isLine": false
                    }, {
                        "header": "Under",
                        "selectionsOrderingByBetGroupId": {
                            "5": 2
                        },
                        "isLine": false
                    }]
                }]
            });

        self.viewData.getBetgroupCompositesViewData("pageData", {
            eventSortBy: 2,
            eventCount: 3,
            eventPhase: 1,
            categoryIds: []
        }).then(function (data) {
            options.givenStartingSoonRequest = _.defaults({categoryIds: options.givenNewFilters}, options.givenStartingSoonRequest);

            self.$httpBackend.whenGET(self.testUrlBuilder.getSportsbookEventApiUrl(
                self.initialTestMarket.id,
                self.initialTestMarket.languageCode,
                options.givenStartingSoonRequest
            )).respond({
                "el": options.givenUpdateRequest
            });

            return data.updateFilters(options.givenStartingSoonRequest)
                .then(function(){
                    return data;
                });
        }).then(function (data) {
            options.thenViewmodel(data._viewModelProperties[0].viewModel);
        });

        self.$httpBackend.flush();
    };

    module.service("scenarioFactory", ScenarioFactory);

})(window.angular);
