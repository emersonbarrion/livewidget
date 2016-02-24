describe("Services: Live-Catalogue", function () {

    beforeEach(module("sportsbook.tests"));

    var catalogue,
        liveCatalogueService,
        $httpBackend,
        $rootScope,
        mockApiResponseFactory,
        testCategories,
        testLiveCategories,
        initialTestMarket,
        testUrlBuilder,
        TASK_NAME;

    beforeEach(function () {

        inject(["$httpBackend", "$rootScope", "liveCatalogueService", "mockApiResponseFactory", "initialTestMarket", "testUrlBuilder", "catalogue", function (_$httpBackend_, _$rootScope_, _liveCatalogueService_, _mockApiResponseFactory_, _initialTestMarket_, _testUrlBuilder_, _catalogue_) {
            catalogue = _catalogue_;
            liveCatalogueService = _liveCatalogueService_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            mockApiResponseFactory = _mockApiResponseFactory_;
            initialTestMarket = _initialTestMarket_;
            testUrlBuilder = _testUrlBuilder_;
        }]);

        testCategories = [
            mockApiResponseFactory.getCategory()
        ];

        testLiveCategories = [
            mockApiResponseFactory.getCategory()
        ];

        $httpBackend.when("GET", testUrlBuilder.getSportsbookCategoryApiUrl(
            initialTestMarket.id,
            initialTestMarket.languageCode, {
                eventPhase: 0
            }
        )).respond(testCategories);

        $httpBackend.when("GET", testUrlBuilder.getSportsbookCategoryApiUrl(
            initialTestMarket.id,
            initialTestMarket.languageCode, {
                eventPhase: 2
            }
        )).respond(testLiveCategories);

        TASK_NAME = "ssk.poller.reload.livecatalogue";

        liveCatalogueService.isActive = true;
    });

    describe("Toggle polling", function () {

        var defaultInterval = 3000;
        var liveInterval = 1000 * 60 * 5;

        beforeEach(function () {
            liveCatalogueService.init({
                liveInterval: liveInterval,
                defaultInterval: defaultInterval
            });
        });

        it("Should set live polling interval if setLiveInterval is invoked", function (done) {
            toggleInterval(function () {
                liveCatalogueService.setLiveInterval();
            }, liveInterval);

            done();
        });

        it("Should set default polling interval if setDefaultInterval is invoked", function (done) {
            toggleInterval(function () {
                liveCatalogueService.setDefaultInterval();
            }, defaultInterval);

            done();
        });

        var toggleInterval = function (setPollerInterval, expectedToBe) {
            setPollerInterval();

            var task = _.find(liveCatalogueService._poller.tasks, {
                key: TASK_NAME
            });
            var taskInterval = task.intervalMillis;

            expect(taskInterval).toBe(expectedToBe);
        };
    });
});
