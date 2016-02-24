describe("Directive: Favorites Button", function () {

    var $compile,
        $rootScope,
        $httpBackend,
        $q,
        applicationState,
        favorites,
        testFavorites;

    var bindDirective = function (node) {
        var scope, element;
        scope = $rootScope.$new();
        scope.competition = node;
        element = $compile("<div favorites-button node='competition'></div>")(scope);
        $httpBackend.flush();
        $rootScope.$digest();
        return element;
    };

    beforeEach(function () {
        // module('ngMockE2E');
        module("sportsbook.favorites", ["sportsbookConfigurationProvider", function (sportsbookConfigurationProvider) {
            sportsbookConfigurationProvider.config = {
                templates: {
                    favoritesButton: "/test-templates/favorite-button.html"
                },
                services: {
                    proxyUrl: "http://proxyUrl.test.com"
                }
            };
        }])

        inject(["$compile", "$rootScope", "$httpBackend", "$q", "applicationState", "favorites", function (_$compile_, _$rootScope_, _$httpBackend_, _$q_, _applicationState_, _favorites_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;
            applicationState = _applicationState_;
            favorites = _favorites_;

            testFavorites = [{
                id: 1,
                slug: "/test/1",
                type: "competition",
                name: "Test 1"
            }, {
                id: 2,
                slug: "/test/2",
                type: "competition",
                name: "Test 2"
            }, {
                id: 3,
                slug: "/test/3",
                type: "competition",
                name: "Test 3"
            }];

            $httpBackend.when("GET", "/test-templates/favorite-button.html").respond(
                "<section ng-if='showFavoritesButton'>" +
                    "<button ng-if='!node.isFavorite && isReady' ng-click='toggleFavorite(node)' id='add'>Add To Favorites</button>" +
                    "<button ng-if='node.isFavorite && isReady' ng-click='toggleFavorite(node)' id='remove'>Remove From Favorites</button>" +
                "</section>"
            );

            applicationState.user({
                isAuthenticated: true
            });
        }])
    });

    it("should show the button to add a favorite if the competition node is not a favorite", function () {
        spyOn(favorites, "getSubCategories").and.returnValue($q.when([]));
        var element = bindDirective(testFavorites[0]);
        expect(element.find("#add").length).toBe(1);
        expect(element.find("#remove").length).toBe(0);
    });

    it("should show the button to remove a favorite if the competition node is a favorite", function () {
        spyOn(favorites, "getSubCategories").and.returnValue($q.when([1]));
        var element = bindDirective(testFavorites[0]);
        expect(element.find("#add").length).toBe(0);
        expect(element.find("#remove").length).toBe(1);
    });

    it("should show the button to add a favorite if the favorites getSubCategories service call fails", function () {
        spyOn(favorites, "getSubCategories").and.returnValue($q.reject("error"));
        var element = bindDirective(testFavorites[0]);
        expect(element.find("#add").length).toBe(1);
        expect(element.find("#remove").length).toBe(0);
    });

    describe("Buttons", function () {

        it("should add a competition to the favorites if the add button is clicked", function () {
            spyOn(favorites, "getSubCategories").and.returnValue($q.when([]));
            spyOn(favorites, "toggleSubCategory").and.returnValue($q.when(true));
            var element = bindDirective(testFavorites[0]);
            element.find("#add").click();
            $rootScope.$digest();
            expect(element.find("#add").length).toBe(0);
            expect(element.find("#remove").length).toBe(1);
        });

        it("should remove a competition from the favorites if the remove button is clicked", function () {
            spyOn(favorites, "getSubCategories").and.returnValue($q.when([1]));
            spyOn(favorites, "toggleSubCategory").and.returnValue($q.when(false));
            var element = bindDirective(testFavorites[0]);
            element.find("#remove").click();
            $rootScope.$digest();
            expect(element.find("#add").length).toBe(1);
            expect(element.find("#remove").length).toBe(0);
        });

        it("should do nothing if the favorites service call fails", function () {
            spyOn(favorites, "getSubCategories").and.returnValue($q.when([1]));
            spyOn(favorites, "toggleSubCategory").and.returnValue($q.reject("error"));
            var element = bindDirective(testFavorites[0]);
            element.find("#remove").click();
            $rootScope.$digest();
            expect(element.find("#add").length).toBe(0);
            expect(element.find("#remove").length).toBe(1);
        });

    });

    describe("User Logins", function () {

        it("should show the favorites button if the user logs in", function () {
            spyOn(favorites, "getSubCategories").and.returnValue($q.when([1]));
            applicationState.user({
                isAuthenticated: false
            });
            var element = bindDirective(testFavorites[0]);
            expect(element.find("button").length).toBe(0);
            applicationState.user({
                isAuthenticated: true
            });
            $rootScope.$digest();
            expect(element.find("button").length).toBe(1);
        });

    });
});
