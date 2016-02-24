describe('Controllers: SEO', function() {

    var scope, eventData, seoContent, applicationState;

    beforeEach(module('sportsbook.views'));

    beforeEach(function () {
        seoContent = {
            htmlContent: 'ABC',
            canonicalUrl: "url",
            metaTitle: "Title: A",
            metaDescription: "Desc: C",
            metaKeywords: "Keywords: B"
        };

        applicationState = {
            culture: {
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
            },
            category: {
                name: "A"
            },
            region: {
                name: "B"
            },
            competition: {
                name: "C"
            },
            event: {
                name: "D"
            }
        };

    });

    describe("Content features", function () {

        beforeEach(inject(["$controller", "$rootScope", "$q", "$location", function ($controller, $rootScope, $q, $location) {

            scope = $rootScope.$new();

            scope.$on("common-events-update-page-meta", function (evt, data) {
                eventData = data;
            });

            $controller('seoCtrl', {
                $scope: scope,
                $rootScope: $rootScope,
                $q: $q,
                $location: $location,
                seoContent: {
                    culture: applicationState.culture,
                    category: applicationState.category,
                    region: applicationState.region,
                    competition: applicationState.competition,
                    event: applicationState.event,
                    data: seoContent
                }
            });

            $rootScope.$digest();
        }]));

        it("Should populate the htmlContent", function() {
            expect(scope.htmlContent).toBe("ABC");
        });

        it("Should broadcast common-events-update-page-meta event", function() {

            expect(eventData.metaTitle).toBe("Title: A");
            expect(eventData.metaKeywords).toBe("Keywords: B");
            expect(eventData.metaDescription).toBe("Desc: C");
            expect(eventData.canonicalUrl).toBe("url");
        });
    });

    describe("State change handling", function() {
        var resource, log;

        beforeEach(inject(["$controller", "$rootScope", "$q", "$location", "$state", "$httpBackend", "apiConfig", "sportsbookPage", "$log",
            function ($controller, $rootScope, $q, $location, $state, $httpBackend, apiConfig, sportsbookPage, $log) {
                resource = sportsbookPage;
                log = $log;
                scope = $rootScope.$new();

                $state.current.name = "market.category.region.competition.event";

                $httpBackend.when("GET", apiConfig.url + "/en/1/pages/landingpages").respond($q.defer().promise);

                $controller('seoCtrl', {
                    $scope: scope,
                    $rootScope: $rootScope,
                    $q: $q,
                    $location: $location,
                    seoContent: {
                        culture: applicationState.culture,
                        category: applicationState.category,
                        region: applicationState.region,
                        competition: applicationState.competition,
                        event: applicationState.event,
                        data: seoContent
                    }
                });

                scope.$digest();
            }
        ]));

        it("Should cancel the content request on state change", function(done) {

            spyOn(log, "info").and.callFake(function() {
                expect(log.info).toHaveBeenCalledWith("Cancelled request");
                done();
            });

            // Raise a state change event.
            scope.$root.$broadcast("$stateChangeStart", {
                name: "B"
            }, {}, {
                name: "A"
            }, {});
        });
    });
});
