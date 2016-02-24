describe("OSB-140 PageData update filters", function () {

    beforeEach(module("sportsbook.tests"));

    var scenarioFactory;
    var mockApiResponseFactory;
    var initialTestMarket;
    var eventDataSourceManager;
    var testUrlBuilder;
    var viewData;

    var $httpBackend;
    var $rootScope;
    var sportsbookConfiguration;

    beforeEach(inject(["scenarioFactory", "mockApiResponseFactory", "initialTestMarket", "eventDataSourceManager", "testUrlBuilder", "viewData", "$httpBackend", "$rootScope", "sportsbookConfiguration",
        function (_scenarioFactory_, _mockApiResponseFactory_, _initialTestMarket_, _eventDataSourceManager_, _testUrlBuilder_, _viewData_, _$httpBackend_, _$rootScope_, _sportsbookConfiguration_) {
            scenarioFactory = _scenarioFactory_;
            mockApiResponseFactory = _mockApiResponseFactory_;
            initialTestMarket = _initialTestMarket_;
            eventDataSourceManager = _eventDataSourceManager_;
            testUrlBuilder = _testUrlBuilder_;
            viewData = _viewData_;
            sportsbookConfiguration = _sportsbookConfiguration_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
        }
    ]));

    it("should return the filter and should allow it to be updated while respecting references", function (done) {
        $httpBackend.whenGET(testUrlBuilder.getSportsbookCategoryApiUrl(
            initialTestMarket.id,
            initialTestMarket.languageCode, {
                eventPhase: 0,
                ocb: sportsbookConfiguration.clientInterfaceIdentifier
            })).respond([
            mockApiResponseFactory.getCategory()
        ]);

        $httpBackend
            .whenGET(testUrlBuilder.getSportsbookEventApiUrl(
                initialTestMarket.id,
                initialTestMarket.languageCode, {
                    betGroupIds: [257, 2141, 507, 2137, 2148],
                    categoryIds: [1],
                    eventPhase: 2,
                    eventSortBy: 1,
                    include: "scoreboard",
                    onlyEvenLineMarkets: true
                }
            )).respond({
                "el": [
                    mockApiResponseFactory.getEvent({
                        "ei": 1,
                        "cep": 2,
                        "ml": mockApiResponseFactory.getMarket({
                            "bgi": 257
                        })
                    })
                ]
            });

        var pageData;

        viewData.getLiveTableByCategoryViewData("pageData", {
            categoryIds: [1]
        }).then(function (_pageData_) {
            pageData = _pageData_;
            pageData.registerDataSourceListeners($rootScope.$new());
        });

        $httpBackend.flush();

        expect(pageData.filters).toEqual({
            categoryIds: [1]
        });

        var dateAndIdRequest = $httpBackend
            .whenGET(testUrlBuilder.getSportsbookEventApiUrl(
                initialTestMarket.id,
                initialTestMarket.languageCode, {
                    betGroupIds: [257, 2141, 507, 2137, 2148],
                    categoryIds: [1],
                    eventStartTo: "2011-08-07T11:11:00",
                    eventPhase: 2,
                    eventSortBy: 1,
                    include: "scoreboard",
                    onlyEvenLineMarkets: true
                }
            )).respond({
                "el": [
                    mockApiResponseFactory.getEvent({
                        "ei": 2,
                        "cep": 2,
                        "ml": mockApiResponseFactory.getMarket({
                            "bgi": 257,
                            "msl": [
                                mockApiResponseFactory.getSelection({
                                    "mst": "1",
                                    "msp": 1.90
                                })
                            ]
                        })
                    })
                ]
            });

        pageData.updateFilters({
            categoryIds: [1],
            eventStartTo: new Date("2011-08-07T11:11:00Z")
        }).then(function () {
            expect(pageData.filters).toEqual({
                categoryIds: [1],
                eventStartTo: new Date("2011-08-07T11:11:00Z")
            });

            expect(pageData.liveMultipleEventTables[0].eventRows[0].id).toBe(2);
        });

        $httpBackend.flush();


        dateAndIdRequest.respond({
            "el": [
                mockApiResponseFactory.getEvent({
                    "ei": 2,
                    "cep": 2,
                    "ml": mockApiResponseFactory.getMarket({
                        "bgi": 257,
                        "msl": [
                            mockApiResponseFactory.getSelection({
                                "mst": "1",
                                "msp": 5
                            })
                        ]
                    })
                })
            ]
        });


        $rootScope.$on("pageData-markets-updated", function (broadcast, data) {
            expect(data[0].selectionDiffsById[1].newOdds).toBe(5);
            done();
        });

        eventDataSourceManager.reloadAll();

        $httpBackend.flush();
    });


});
