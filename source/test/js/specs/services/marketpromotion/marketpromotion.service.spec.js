describe("Service: MarketPromotion", function () {

    // Market Promotion Service
    var service;

    beforeEach(module("sportsbook.promotions"));

    beforeEach(inject(["marketPromotionService", function (marketPromotionService) {
        service = marketPromotionService;
    }]));

    describe("get Method", function () {

        // Dependencies
        var resource, $q, rootScope, httpBackend, dsm, appState, catalogue;

        // Mock data
        var mockResourceResponse, mockCompetition, mockEventListDataSource, mockEmptyEventList;


        beforeEach(inject(["marketPromotionResource", "$q", "$rootScope", "$httpBackend", "applicationState", "eventDataSourceManager", "catalogue", function (marketPromotionResource, _$q, $rootScope, $httpBackend, applicationState, eventDataSourceManager, _catalogue) {
            resource = marketPromotionResource;
            $q = _$q;
            rootScope = $rootScope;
            httpBackend = $httpBackend;
            dsm = eventDataSourceManager;
            appState = applicationState;
            catalogue = _catalogue;

            // Assume the language to be en
            applicationState.culture({
                "countryCode": "GB",
                "cultureInfo": "en-GB",
                "currencyCode": "GBP",
                "currencySymbol": "£",
                "dateFormat": "dd/MM/yy",
                "id": 601,
                "languageCode": "en",
                "name": "English",
                "numberFormat": ".",
                "timeFormat": "HH:mm",
                "urlMarketCode": "en"
            });

            // Assume the user is logged out
            spyOn(appState, "user").and.returnValue($q.when({
                isAuthenticated: false
            }));


            mockResourceResponse = {
                "type": "ImageBanner",
                "img": "test_image.jpg",
                "url": null,
                "content": "Test Content",
                "meta": {
                    "market": "4",
                    "event": "3",
                    "competition": "2"
                }
            };

            mockCompetition = {
                "id": 1,
                "name": "Test Competition",
                "slug": "test-competition"
            };

            mockEventListDataSource = {
                "content": [{
                    "id": 3,
                    "name": "Test Event",
                    "shortName": "test-event",
                    "getMarkets": function () {
                        return [
                            { "id": 1 },
                            { "id": 2 },
                            { "id": 3 },
                            { "id": 4 },
                            { "id": 5 }
                        ];
                    }
                }]
            };

            mockEmptyEventList = {
                "content": []
            };

        }]));


        it("Should request the promotion from the service when logged in.", function (done) {

            // Assume the user is logged in
            appState.user({ isAuthenticated: true });

            // Mock the resource query
            spyOn(resource, "get").and.callFake(function (params) {
                console.log("Mocking response for '" + params.area + "' market promotion request in language: " + params.language + ".");
                return { $promise: $q.when(mockResourceResponse) };
            });

            // Mock the competition
            spyOn(catalogue, "getCompetition").and.returnValue(mockCompetition);

            // Mock the events
            spyOn(dsm, "createGenericEventListDataSource").and.callFake(function () {
                console.log("Mocking event list of length " + mockEventListDataSource.content.length + ".");
                return $q.when(mockEventListDataSource);
            });

            service.get("test").then(function (result) {
                expect(result.type).toBe("ImageBanner");
                expect(result.url).toBe("test-competition/test-event");
                expect(result.content).toBe("Test Content");
                expect(result.img).toBe("test_image.jpg");
                done();
            });

            rootScope.$digest();

        });

        it("Should request the promotion from the service when logged out.", function (done) {

            // Mock the resource query
            spyOn(resource, "get").and.callFake(function (params) {
                console.log("Mocking response for '" + params.area + "' market promotion request in language: " + params.language + ".");
                return { $promise: $q.when(mockResourceResponse) };
            });

            // Mock the competition
            spyOn(catalogue, "getCompetition").and.returnValue(mockCompetition);

            // Mock the events
            spyOn(dsm, "createGenericEventListDataSource").and.callFake(function () {
                console.log("Mocking event list of length " + mockEventListDataSource.content.length + ".");
                return $q.when(mockEventListDataSource);
            });

            service.get("test").then(function (result) {
                expect(result.type).toBe("ImageBanner");
                expect(result.url).toBe("test-competition/test-event");
                expect(result.content).toBe("Test Content");
                expect(result.img).toBe("test_image.jpg");
                done();
            });

            rootScope.$digest();

        });

        it("Should return a promotion with an empty meta property if no events are found.", function (done) {

            // Mock the resource query
            spyOn(resource, "get").and.callFake(function (params) {
                console.log("Mocking response for '" + params.area + "' market promotion request in language: " + params.language + ".");
                return { $promise: $q.when(mockResourceResponse) };
            });

            // Mock the competition
            spyOn(catalogue, "getCompetition").and.returnValue(mockCompetition);

            // Mock an empty event list
            spyOn(dsm, "createGenericEventListDataSource").and.callFake(function () {
                console.log("Mocking event list of length " + mockEmptyEventList.content.length + ".");
                return $q.when(mockEmptyEventList);
            });

            service.get("test").then(function (result) {
                expect(result).toEqual(jasmine.objectContaining({
                    "type": "ImageBanner",
                    "content": "Test Content",
                    "img": "test_image.jpg",
                    "url": ""
                }));
                done();
            });

            rootScope.$digest();

        });

        it("Should return null if the promotion is empty/null.", function (done) {

            // Mock a null response from the resource
            spyOn(resource, "get").and.callFake(function (params) {
                console.log("Mocking null response for '" + params.area + "' market promotion request in language: " + params.language + ".");
                return { $promise: $q.when(null) };
            });

            // Mock the competition
            spyOn(catalogue, "getCompetition").and.returnValue(mockCompetition);

            // Mock the events
            spyOn(dsm, "createGenericEventListDataSource").and.callFake(function () {
                console.log("Mocking event list of length " + mockEventListDataSource.content.length + ".");
                return $q.when(mockEventListDataSource);
            });

            service.get("test").then(function (result) {
                expect(result).toBe(null);
                done();
            });

            rootScope.$digest();

        });

    });

});
