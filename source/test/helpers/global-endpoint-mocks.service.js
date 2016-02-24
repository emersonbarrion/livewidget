(function (angular) {
    function GlobalEndpointMocks($httpBackend, initialTestMarket, testUrlBuilder) {
        this._$httpBackend = $httpBackend;
        this._testUrlBuilder = testUrlBuilder;
        this._initialTestMarket = initialTestMarket;

        this._endPointsBeingMocked = false;
    }

    GlobalEndpointMocks.$inject = ["$httpBackend", "initialTestMarket", "testUrlBuilder"];

    GlobalEndpointMocks.prototype.mockEndpoints = function () {
        if (this._endPointsBeingMocked) {
            throw new Error("Global endpoints already being mocked.");
        }

        var $httpBackend = this._$httpBackend;
        var initialTestMarket = this._initialTestMarket;
        var testUrlBuilder = this._testUrlBuilder;

        var initialMarketCode = initialTestMarket.urlMarketCode;

        // Specify sports to load
        $httpBackend.whenGET(testUrlBuilder.getLiveLobbyConfigUrl(initialMarketCode)).respond({
            "liveMultipleEventsTable": {
                "categoryIds": [1, 11],
                "limit": 100
            }
        });

        // Specify bet groups.
        $httpBackend.whenGET(testUrlBuilder.getWidgetConfigUrl(initialMarketCode)).respond({
            "1": [{
                "name": "competition-section",
                "betGroups": [1, 5, 65, 2, 127]
            }, {
                "name": "live-competition-section",
                "betGroups": [257, 2141, 507, 2137, 2148],
                "handicapBetGroups": [2137]
            }, {
                "name": "winner-list",
                "widgets": [{
                    "title": "sportsbook.widgets.winnerlist.Winnerlist",
                    "limit": 3,
                    "layout": ["large-6", "large-6"],
                    "defaultClass": "",
                    "groups": [{
                        "betGroupId": 562,
                        "isHeadToHead": true
                    }, {
                        "betGroupId": 78
                    }]
                }]
            }, {
                "name": "homepage-live-events-section",
                "betGroups": [257]
            }],
            "11": [{
                "name": "competition-section",
                "scoreboard": "tennis",
                "limit": 3,
                "betGroups": [27, 52, 657, 51, 375],
                "handicapBetGroups": [52, 657]
            }, {
                "name": "live-competition-section",
                "scoreboard": "tennis",
                "limit": 10,
                "betGroups": [649, 2433, 2434, 2435, 650],
                "handicapBetGroups": [52, 657]
            }, {
                "name": "winner-list",
                "limit": 10,
                "title": "sportsbook.widgets.winnerlist.Winnerlist",
                "defaultTemplate": "/templates/sportsbook/winner-list/winner-list-view.html",
                "widgets": [{
                    "title": "sportsbook.widgets.winnerlist.Winnerlist",
                    "limit": 3,
                    "layout": ["large-6", "large-6"],
                    "defaultClass": "",
                    "groups": [{
                        "betGroupId": 80,
                        "isHeadToHead": true
                    }, {
                        "betGroupId": 81
                    }]
                }]
            }, {
                "name": "homepage-live-events-section",
                "scoreboard": "tennis",
                "limit": 10,
                "betGroups": [649, 2433]
            }, {
                "name": "live-event-section",
                "widgets": [{
                    "title": "popular-market",
                    "defaultColumns": 2,
                    "group": [{
                        "betGroups": [257]
                    }, {
                        "betGroups": [2148]
                    }]
                }]
            }]
        });

        //Specify home page configuration
        $httpBackend.when("GET", testUrlBuilder.getHomePageConfigUrl(initialTestMarket.urlMarketCode)).respond({
            "multipleEventsTable": {
                "categoryIds": [1]
            },
            "liveMultipleEventsTable": {
                "categoryIds": [1]
            },
            "winnerLists": {
                "categoryIds": [1]
            },
            "mostPopular": {
                "categoryIds": [1]
            },
            "startingSoon": {
                "limit": 3,
                "betGroupIds": [1, 27],
                "categoryIds": [],
                "compositeColumns": [
                    {
                        "header": "Match Winner",
                        "possibleBetGroupIds": [1, 27],
                        "columns": [
                            {
                                "header": "1",
                                "selectionsOrderingByBetGroupId": {
                                    "1": 1,
                                    "27": 1
                                },
                                "isLine": false
                            },
                            {
                                "header": "X",
                                "selectionsOrderingByBetGroupId": {
                                    "1": 2,
                                    "27": null
                                },
                                "isLine": false
                            },
                            {
                                "header": "2",
                                "selectionsOrderingByBetGroupId": {
                                    "1": 3,
                                    "27": 2
                                },
                                "isLine": false
                            }
                        ]
                    }
                ]
            }
        });

        // Mock session info
        $httpBackend.whenPOST(testUrlBuilder.getSportsbookSessionInfoUrl()).respond({
            "token": "TEST_TOKEN",
            "segmentId": "601"
        });
        $httpBackend.whenGET(testUrlBuilder.getLoginUrl("601", "TEST_TOKEN")).respond(true);

        // Specify category mappings
        // This is an example of how a global mock can become overridable
        this._categoryMappingsResponse = $httpBackend.whenGET(testUrlBuilder.getSportsbookCategoryMappingsUrl())
            .respond({
                "1": {
                    "name": "football",
                    "iconHint": "football"
                },
                "11": {
                    "name": "tennis",
                    "iconHint": "tennis"
                }
            });

        this._endPointsBeingMocked = true;

    };

    function overrideFunctionFactory(f) {
        return function () {
            if (!this._endPointsBeingMocked) {
                throw new Error("Attempted to use override function without mocking endpoints first.");
            }

            return f.apply(this, arguments);
        };
    }

    //This is an example of a function which would allow the global endpoint mocks to be overridden.
    GlobalEndpointMocks.prototype.overrideCategoryMappings = overrideFunctionFactory(function (data) {
        this._categoryMappingsResponse.respond(data);
    });

    angular.module("sportsbook.tests").service("globalEndpointMocks", GlobalEndpointMocks);

})(window.angular);
