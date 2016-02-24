describe("Utilities: Content preloader", function () {

    var preloader, apiConfig, applicationState, widgetConfigurations, eventService, $q, $rootScope, $timeout, $httpBackend, testCulture;

    beforeEach(module("sportsbook.application"));
    beforeEach(module("sportsbook.catalogue"));
    beforeEach(module("sportsbook.performance"));

    beforeEach(inject(["preloader", "apiConfig", "applicationState", "widgetConfigurations", "eventService", "$q", "$rootScope", "$timeout", "$httpBackend", "CacheFactory",
        function (_preloader_, _apiConfig_, _applicationState_, _widgetConfigurations_, _eventService_, _$q_, _$rootScope_, _$timeout_, _$httpBackend_, CacheFactory) {

            preloader = _preloader_;
            eventService = _eventService_;
            widgetConfigurations = _widgetConfigurations_;
            applicationState = _applicationState_;
            apiConfig = _apiConfig_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
            $httpBackend = _$httpBackend_;
            spyOn(CacheFactory, "get").and.returnValue({
                get: function () {},
                put: function () {},
                remove: function () {},
                removeAll: function () {}
            });

            testCulture = {
                urlMarketCode: "en"
            };

            $httpBackend.when("GET", "http://www.test.com/category?eventPhase=1").respond([]);

            apiConfig.urlFor = function (options) {
                return $q.when("http://www.test.com" + options.path);
            };
        }
    ]));

    it("Should not take any action if it has already been actioned", function () {

        preloader.actioned = true;
        preloader.preload();

        // Expectation to suppress the warning. This test will fail if the preloader tries
        // to do anything, as the backend etc are not expecting any activity.
        expect(true).toBe(true);
    });

    describe("Loading", function () {


        it("Should request the data for the specified categories", function (done) {

            $httpBackend.when("GET", "/templates/config/preloading/en.js").respond({
                preload: true,
                delay: 0,
                requests: [{
                    market: "en",
                    category: {
                        id: 1,
                        name: "football"
                    },
                    region: {
                        id: 11,
                        name: "england"
                    }
                }, {
                    market: "en",
                    category: {
                        name: "football",
                        id: 1
                    },
                    region: {
                        id: 11,
                        name: "england"
                    },
                    competition: {
                        id: 3,
                        name: "fa-premiership"
                    },
                    event: {
                        id: 663727,
                        name: "tottenham-arsenal"
                    }
                }, {
                    market: "en",
                    category: {
                        name: "tennis",
                        id: 11
                    }
                }]
            });

            var competition = $q.defer();
            var event = $q.defer();
            var config = $q.defer();

            applicationState.culture(testCulture);

            spyOn(widgetConfigurations, "getForMarket").and.returnValue(config.promise);

            competition.resolve({
                ok: true
            });
            event.resolve({
                ok: true
            });
            config.resolve({});

            $rootScope.$on("preload.complete", function () {
                expect(widgetConfigurations.getForMarket).toHaveBeenCalledWith("en");
                expect(preloader.actioned).toBe(true);
                done();
            });

            preloader.preload();

            $httpBackend.flush();
            $timeout.flush();
            $rootScope.$apply();
            $rootScope.$digest();
        });

        it("Should exit if the configuration says that preloading is inactive.", function (done) {

            $httpBackend.when("GET", "/templates/config/preloading/en.js").respond({
                preload: false
            });

            applicationState.culture(testCulture);

            $rootScope.$on("preload.complete", function () {
                expect(preloader.actioned).toBe(true);
                done();
            });

            preloader.preload();

            $httpBackend.flush();
            $rootScope.$digest();
        });

        it("Should try to load the default configuration if the market configuration is not defined.", function (done) {

            $httpBackend.when("GET", "/templates/config/preloading/sv.js").respond(404);

            $httpBackend.when("GET", "/templates/config/preloading/en.js").respond({
                preload: false
            });

            applicationState.culture({
                urlMarketCode: "sv"
            });

            $rootScope.$on("preload.complete", function () {
                expect(preloader.actioned).toBe(true);
                done();
            });

            preloader.preload();

            $httpBackend.flush();
            $rootScope.$digest();
        });

        it("Should treat a configuration loading error as no configuration.", function (done) {

            $httpBackend.when("GET", "/templates/config/preloading/en.js").respond(500);

            applicationState.culture(testCulture);

            $rootScope.$on("preload.complete", function () {
                expect(preloader.actioned).toBe(true);
                done();
            });

            preloader.preload();

            $httpBackend.flush();
            $rootScope.$digest();
        });
    });
});
