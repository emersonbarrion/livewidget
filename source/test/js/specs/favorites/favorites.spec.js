describe("Service: Favorites", function () {

    var $httpBackend, $q, $rootScope, cache, applicationState, prematchSession, favorites;

    beforeEach(module("sportsbook.favorites", ["sportsbookConfigurationProvider", function (sportsbookConfigurationProvider) {
        sportsbookConfigurationProvider.config = {
            services: {
                favoritesApi: "http://www.test.com"
            }
        };
    }]));

    beforeEach(inject(["$httpBackend", "$q", "$rootScope", "CacheFactory", "applicationState", "prematchSession", "favorites", function (_$httpBackend, _$q, _$rootScope, CacheFactory, _applicationState, _prematchSession, _favorites) {
        $httpBackend = _$httpBackend;
        $q = _$q;
        $rootScope = _$rootScope;
        applicationState = _applicationState;
        prematchSession = _prematchSession;
        favorites = _favorites;

        cache = CacheFactory.get("ssk.cache.sb.user-settings");

        applicationState.user({
            "isAuthenticated": true
        });

        spyOn(prematchSession, "getSessionInfo").and.returnValue($q.when({
            "segmentId": 601,
            "token": "C11A5D84-6F25-496D-AF21-BAA56DE72150"
        }));
    }]));

    describe("getSubCategories method", function () {

        var mockGetResponse = {
            "favoriteSubCategories": [10, 20, 30]
        };

        it("should return a list of sub category IDs that have been favorited by the user", function (done) {
            $httpBackend.when("GET", "http://www.test.com/favoritesubcategories?segmentId=601&sessionId=C11A5D84-6F25-496D-AF21-BAA56DE72150").respond(mockGetResponse);
            favorites.getSubCategories().then(function (favoriteSubCategories) {
                expect(favoriteSubCategories).toEqual([10, 20, 30]);
                done();
            });
            $httpBackend.flush();
        });

        it("should return the cached favorites list if it exists", function (done) {
            cache.put("favoriteSubCategories", [11, 22, 33]);
            favorites.getSubCategories().then(function (favoriteSubCategories) {
                expect(favoriteSubCategories).toEqual([11, 22, 33]);
                done();
            });
            $httpBackend.flush();
        });

        it("should return an empty list if the server does not respond with a correct response", function (done) {
            $httpBackend.when("GET", "http://www.test.com/favoritesubcategories?segmentId=601&sessionId=C11A5D84-6F25-496D-AF21-BAA56DE72150").respond({});
            favorites.getSubCategories().then(function (favoriteSubCategories) {
                expect(favoriteSubCategories).toEqual([]);
                done();
            });
            $httpBackend.flush();
        });

        it("should reject if the user is not authenticated", function (done) {
            applicationState.user({
                "isAuthenticated": false
            });
            favorites.getSubCategories().then(
                function (favorites) {
                    fail();
                    done();
                },
                function (error) {
                    expect(error).toBeDefined();
                    done();
                }
            );
            $rootScope.$digest();
        });

    });

    describe("addSubCategory method", function () {

        it("should successfully add a sub category to the favorites list", function (done) {
            $httpBackend.when("PUT", "http://www.test.com/favoritesubcategories/10").respond(201);
            favorites.addSubCategory(10).then(function (result) {
                expect(result).toBe(true);
                done();
            });
            $httpBackend.flush();
        });

        it("should invalidate the cache if the sub category was added successfully", function (done) {
            cache.put("favoriteSubCategories", [11, 22, 33]);
            $httpBackend.when("PUT", "http://www.test.com/favoritesubcategories/10").respond(201);
            favorites.addSubCategory(10).then(function (result) {
                var cachedFavorites = cache.get("favoriteSubCategories");
                expect(cachedFavorites).toBeUndefined();
                done();
            });
            $httpBackend.flush();
        });

        it("should reject if the server API call fails for some reason", function (done) {
            $httpBackend.when("PUT", "http://www.test.com/favoritesubcategories/10").respond(400);
            favorites.addSubCategory(10).then(
                function (result) {
                    fail();
                    done();
                },
                function (error) {
                    expect(error).toBeDefined();
                    done();
                }
            );
            $httpBackend.flush();
        });

        it("should reject if the customer is not authenticated", function (done) {
            applicationState.user({
                "isAuthenticated": false
            });
            favorites.addSubCategory(10).then(
                function (result) {
                    fail();
                    done();
                },
                function (error) {
                    expect(error).toBeDefined();
                    done();
                }
            );
            $rootScope.$digest();
        });

        it("should reject if the sub category ID is not a valid number", function (done) {
            favorites.addSubCategory("invalid").then(
                function (result) {
                    fail();
                    done();
                },
                function (error) {
                    expect(error).toBeDefined();
                    done();
                }
            );
            $rootScope.$digest();
        });

    });

    describe("removeSubCategory", function () {

        it("should successfully remove a sub category from the favorites list", function (done) {
            $httpBackend.when("DELETE", "http://www.test.com/favoritesubcategories/10").respond(201);
            favorites.removeSubCategory(10).then(function (result) {
                expect(result).toBe(true);
                done();
            });
            $httpBackend.flush();
        });

        it("should invalidate the cache if the sub category was added successfully", function (done) {
            cache.put("favoriteSubCategories", [11, 22, 33]);
            $httpBackend.when("DELETE", "http://www.test.com/favoritesubcategories/10").respond(201);
            favorites.removeSubCategory(10).then(function (result) {
                var cachedFavorites = cache.get("favoriteSubCategories");
                expect(cachedFavorites).toBeUndefined();
                done();
            });
            $httpBackend.flush();
        });

        it("should reject if the server API call fails for some reason", function (done) {
            $httpBackend.when("DELETE", "http://www.test.com/favoritesubcategories/10").respond(400);
            favorites.removeSubCategory(10).then(
                function (result) {
                    fail();
                    done();
                },
                function (error) {
                    expect(error).toBeDefined();
                    done();
                }
            );
            $httpBackend.flush();
        });

        it("should reject if the customer is not authenticated", function (done) {
            applicationState.user({
                "isAuthenticated": false
            });
            favorites.removeSubCategory(10).then(
                function (result) {
                    fail();
                    done();
                },
                function (error) {
                    expect(error).toBeDefined();
                    done();
                }
            );
            $rootScope.$digest();
        });

        it("should reject if the sub category ID is not a valid number", function (done) {
            favorites.removeSubCategory("invalid").then(
                function (result) {
                    fail();
                    done();
                },
                function (error) {
                    expect(error).toBeDefined();
                    done();
                }
            );
            $rootScope.$digest();
        });

    });

    describe("toggleSubCategory", function () {

        it("should successfully remove a sub category from the favorites list if the flag is false", function (done) {
            $httpBackend.when("DELETE", "http://www.test.com/favoritesubcategories/10").respond(201);
            favorites.toggleSubCategory(false, 10).then(function (result) {
                expect(result).toBe(false);
                done();
            });
            $httpBackend.flush();
        });

        it("should successfully remove a sub category from the favorites list if the flag is false", function (done) {
            $httpBackend.when("PUT", "http://www.test.com/favoritesubcategories/10").respond(201);
            favorites.toggleSubCategory(true, 10).then(function (result) {
                expect(result).toBe(true);
                done();
            });
            $httpBackend.flush();
        });

        it("should reject if the user is not authenticated", function (done) {
            applicationState.user({
                "isAuthenticated": false
            });
            favorites.toggleSubCategory(true, 10).then(
                function (result) {
                    fail();
                    done();
                },
                function (error) {
                    expect(error).toBeDefined();
                    done();
                }
            );
            $rootScope.$digest();
        });

    });

})﻿;
