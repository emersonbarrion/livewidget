
describe("Services: Statistics", function () {

    var service, $q, $rootScope, $httpBackend;

    beforeEach(module("angular-sitestack-utilities"));
    beforeEach(module("sportsbook.application"));
    beforeEach(module("sportsbook.statistics"));

    beforeEach(inject(function ($injector) {

        var cfg = $injector.get("sportsbookConfiguration");
        var applicationState = $injector.get("applicationState");
        $httpBackend = $injector.get("$httpBackend");
        $q = $injector.get("$q");
        $rootScope = $injector.get("$rootScope");

        cfg.statistics = {
            serviceUrl: "http://statistics.test.com",
            apiKey: "oc950nV05957hj38}^P@14EC0%Q+{",
            partner: "betsson"
        };

        applicationState.culture({
            countryCode: "GB",
            cultureInfo: "en-GB",
            currencyCode: "GBP",
            currencySymbol: "£",
            dateFormat: "dd/MM/yy",
            id: 601,
            languageCode: "en",
            name: "English",
            numberFormat: ".",
            threeLetterLanguageCode: "eng",
            timeFormat: "HH:mm",
            timeZone: "Europe/London",
            timeZoneStandardName: "GMT Standard Time",
            urlMarketCode: "en"
        });

    }));

    beforeEach(inject(["statistics", function (statisticsService) {
        service = statisticsService;
    }]));

    var rawTablesApiData = {
        "tables": [{
            "lastUpdatedDate": "2015-04-23 07:02",
            "leagueId": 6117,
            "leagueName": "Premier League",
            "seasonId": 1640704,
            "sportId": 6046,
            "tableLines": [{
                "end": 3,
                "name": "Champions League",
                "nextLeagueId": 888518,
                "start": 1
            }, {
                "end": 5,
                "name": "UEFA Europa League Qualification",
                "nextLeagueId": 888517,
                "start": 5
            }, {
                "end": 4,
                "name": "Champions League Qualification",
                "nextLeagueId": 888516,
                "start": 4
            }, {
                "end": 20,
                "name": "Relegation",
                "nextLeagueId": 781055,
                "start": 18
            }],
            "tableRows": [

                {
                    "away": {
                        "d": 2,
                        "ga": 3,
                        "gd": 0,
                        "gf": 3,
                        "gp": 2,
                        "l": 0,
                        "pts": 2,
                        "w": 0
                    },

                    "home": {
                        "d": 0,
                        "ga": 1,
                        "gd": 1,
                        "gf": 2,
                        "gp": 1,
                        "l": 0,
                        "pts": 3,
                        "w": 1
                    },

                    "pos": 7,

                    "team": {
                        "id": 3,
                        "name": "Arsenal",
                        "shortName": "ARS"
                    },

                    "total": {
                        "d": 2,
                        "ga": 4,
                        "gd": 1,
                        "gf": 5,
                        "gp": 3,
                        "l": 0,
                        "pts": 5,
                        "w": 1
                    }
                }
            ]
        }],
        "version": 1429765320468
    };

    var rawHead2HeadApiData = {
        "events": [{
            "awayId": 3,
            "awayName": "Arsenal",
            "awayScore": 2,
            "awayShortName": "ARS",
            "date": "2014-01-13 17:00",
            "homeId": 18,
            "homeName": "Aston Villa",
            "homeScore": 1,
            "homeShortName": "ASV",
            "id": 1401105,
            "league": "Premier League",
            "season": "2013/2014"
        }]
    };

    var rawFixturesApiData = {
        "participants": [{
            "events": [{
                "awayId": 1044,
                "awayName": "Swansea City",
                "awayScore": null,
                "awayShortName": "SWA",
                "date": "2015-05-09 13:00",
                "homeId": 3,
                "homeName": "Arsenal",
                "homeScore": null,
                "homeShortName": "ARS",
                "id": 1641091,
                "league": "Premier League",
                "season": "2014/2015"
            }],
            "id": 3,
            "name": "Arsenal",
            "shortName": "ARS"
        }]
    };


    var rawStatisticsApiData = {
        "events": [{
            "id": 1640990,
            "date": "2015-02-22 12:00",
            "homeId": 21,
            "homeName": "Tottenham Hotspur",
            "homeShortName": "TOT",
            "homeScore": 2,
            "awayId": 11,
            "awayName": "West Ham United",
            "awayShortName": "WHU",
            "awayScore": 2,
            "league": "Premier League",
            "season": "2014/2015"
        }, {
            "id": 1640715,
            "date": "2014-08-16 15:00",
            "homeId": 11,
            "homeName": "West Ham United",
            "homeShortName": "WHU",
            "homeScore": 0,
            "awayId": 21,
            "awayName": "Tottenham Hotspur",
            "awayShortName": "TOT",
            "awayScore": 1,
            "league": "Premier League",
            "season": "2014/2015"
        }, {
            "id": 1401290,
            "date": "2014-05-03 12:45",
            "homeId": 11,
            "homeName": "West Ham United",
            "homeShortName": "WHU",
            "homeScore": 2,
            "awayId": 21,
            "awayName": "Tottenham Hotspur",
            "awayShortName": "TOT",
            "awayScore": 0,
            "league": "Premier League",
            "season": "2013/2014"
        }, {
            "id": 1520958,
            "date": "2013-12-18 19:45",
            "homeId": 21,
            "homeName": "Tottenham Hotspur",
            "homeShortName": "TOT",
            "homeScore": 1,
            "awayId": 11,
            "awayName": "West Ham United",
            "awayShortName": "WHU",
            "awayScore": 2,
            "league": "Capital One Cup",
            "season": "2013/2014"
        }, {
            "id": 1400959,
            "date": "2013-10-06 16:00",
            "homeId": 21,
            "homeName": "Tottenham Hotspur",
            "homeShortName": "TOT",
            "homeScore": 0,
            "awayId": 11,
            "awayName": "West Ham United",
            "awayShortName": "WHU",
            "awayScore": 3,
            "league": "Premier League",
            "season": "2013/2014"
        }]
    };

    var tableData = {
        lastUpdatedDate: '2015-01-01',
        leagueId: 1337,
        leagueName: 'Test League',
        seasonId: 12,
        sportId: 123,
        lines: [{
            start: 1,
            end: 4,
            name: 'Test Line',
            nextLeagueId: 2,
        }],
        rows: [{
            pos: 1,
            team: {
                id: 1234,
                name: 'Team A',
                shortName: 'TA',
            },
            home: {
                gp: 1,
                pts: 3,
                w: 1,
                d: 0,
                l: 0,
                gf: 5,
                ga: 0,
                gd: 5
            },
            away: {
                gp: 1,
                pts: 0,
                w: 0,
                d: 0,
                l: 1,
                gf: 0,
                ga: 1,
                gd: -1
            },
            total: {
                gp: 2,
                pts: 3,
                w: 1,
                d: 0,
                l: 1,
                gf: 5,
                ga: 1,
                gd: 4
            }
        }, {
            pos: 2,
            team: {
                id: 1235,
                name: 'Team B',
                shortName: 'TB',
            },
            home: {
                gp: 2,
                pts: 1,
                w: 0,
                d: 1,
                l: 1,
                gf: 1,
                ga: 2,
                gd: -1
            },
            away: {
                gp: 0,
                pts: 0,
                w: 0,
                d: 0,
                l: 0,
                gf: 0,
                ga: 0,
                gd: 0
            },
            total: {
                gp: 2,
                pts: 1,
                w: 0,
                d: 1,
                l: 1,
                gf: 1,
                ga: 2,
                gd: -1
            }
        }, {
            pos: 3,
            team: {
                id: 1236,
                name: 'Team C',
                shortName: 'TC',
            },
            home: {
                gp: 2,
                pts: 1,
                w: 0,
                d: 1,
                l: 1,
                gf: 1,
                ga: 2,
                gd: -1
            },
            away: {
                gp: 0,
                pts: 0,
                w: 0,
                d: 0,
                l: 0,
                gf: 0,
                ga: 0,
                gd: 0
            },
            total: {
                gp: 2,
                pts: 1,
                w: 0,
                d: 1,
                l: 1,
                gf: 1,
                ga: 2,
                gd: -1
            }
        }]
    };

    var standingsData = {
        lastUpdatedDate: '2015-01-01',
        leagueId: 1337,
        leagueName: 'Test League',
        seasonId: 12,
        sportId: 123,
        lines: [{
            start: 1,
            end: 4,
            name: 'Test Line',
            nextLeagueId: 2,
        }],
        rows: [{
            pos: 1,
            team: {
                id: 1234,
                name: 'Team A',
                shortName: 'TA',
            },
            home: {
                gp: 1,
                pts: 3,
                w: 1,
                d: 0,
                l: 0,
                gf: 5,
                ga: 0,
                gd: 5
            },
            away: {
                gp: 1,
                pts: 0,
                w: 0,
                d: 0,
                l: 1,
                gf: 0,
                ga: 1,
                gd: -1
            },
            total: {
                gp: 2,
                pts: 3,
                w: 1,
                d: 0,
                l: 1,
                gf: 5,
                ga: 1,
                gd: 4
            }
        }, {
            pos: 3,
            team: {
                id: 1236,
                name: 'Team C',
                shortName: 'TC',
            },
            home: {
                gp: 2,
                pts: 1,
                w: 0,
                d: 1,
                l: 1,
                gf: 1,
                ga: 2,
                gd: -1
            },
            away: {
                gp: 0,
                pts: 0,
                w: 0,
                d: 0,
                l: 0,
                gf: 0,
                ga: 0,
                gd: 0
            },
            total: {
                gp: 2,
                pts: 1,
                w: 0,
                d: 1,
                l: 1,
                gf: 1,
                ga: 2,
                gd: -1
            }
        }]
    };

    var headToHeadData = {
        "events": [{
            "id": 1234567,
            "date": "19/05/15",
            "homeId": 1234,
            "homeName": "Team A",
            "homeShortName": "TA",
            "homeScore": 3,
            "awayId": 1236,
            "awayName": "Team C",
            "awayShortName": "TC",
            "awayScore": 0,
            "league": "Test League",
            "season": "2015"
        }, {
            "id": 1234568,
            "date": "25/02/15",
            "homeId": 1236,
            "homeName": "Team C",
            "homeShortName": "TC",
            "homeScore": 1,
            "awayId": 1234,
            "awayName": "Team A",
            "awayShortName": "TA",
            "awayScore": 1,
            "league": "Test League",
            "season": "2015"
        }]
    }

    var fixturesData = {
        "participants": [{
            "events": [{
                "id": 1234567,
                "date": "24/05/15",
                "homeId": 1234,
                "homeName": "Team A",
                "homeShortName": "TA",
                "homeScore": 2,
                "awayId": 82,
                "awayName": "Team B",
                "awayShortName": "TB",
                "awayScore": 1,
                "league": "Test Champions League",
                "season": "2015"
            }, {
                "id": 1234568,
                "date": "19/05/15",
                "homeId": 1236,
                "homeName": "Team C",
                "homeShortName": "TC",
                "homeScore": 1,
                "awayId": 1234,
                "awayName": "Team A",
                "awayShortName": "TA",
                "awayScore": 1,
                "league": "Test League",
                "season": "2015"
            }],
            "id": 1234,
            "name": "Team A",
            "shortName": "TA"
        }, {
            "events": [{
                "id": 1234569,
                "date": "25/05/15",
                "homeId": 76,
                "homeName": "Team B",
                "homeShortName": "TB",
                "homeScore": 0,
                "awayId": 1236,
                "awayName": "Team C",
                "awayShortName": "TC",
                "awayScore": 2,
                "league": "Test League",
                "season": "2015"
            }, {
                "id": 1234568,
                "date": "19/05/15",
                "homeId": 1236,
                "homeName": "Team C",
                "homeShortName": "TC",
                "homeScore": 1,
                "awayId": 1234,
                "awayName": "Team A",
                "awayShortName": "TA",
                "awayScore": 1,
                "league": "Test League",
                "season": "2015"
            }],
            "id": 1236,
            "name": "Team C",
            "shortName": "TC"
        }]
    };

    describe("cancellation", function () {
        it("should create a new cancellation promise on $stateChangeStart", function (done) {
            var testCancellation = service.cancellation;
            testCancellation.promise.then(function () {
                expect(service.cancellation).not.toBe(testCancellation);
                done();
            });
            $rootScope.$broadcast("$stateChangeStart");
            $rootScope.$apply();
        });
    });

    describe("getTable", function () {
        it("should return the competition table view model", function (done) {
            $httpBackend.when("GET", /http\:\/\/statistics\.test\.com\/tables\/betsson\/1337\/eng\/0.json.*/).respond(rawTablesApiData);
            service.getTable("1337", {
                fields: "pts"
            }).then(function (result) {
                expect(result.leagueId).toBe(6117);
                expect(result.leagueName).toBe("Premier League");
                expect(result.rows.length).toBe(1);
                done();
            });
            $httpBackend.flush();
        });

        it("should return null if the API call fails", function (done) {
            $httpBackend.when("GET", /http\:\/\/statistics\.test\.com\/tables\/betsson\/1337\/eng\/0.json.*/).respond(404);
            service.getTable("1337").then(function (result) {
                expect(result).toBe(null);
                done();
            });
            $httpBackend.flush();
        });

        it("should throw an error if no competition ID was passed as a parameter", function () {
            expect(function () {
                service.getTable();
            }).toThrow();
            expect(function () {
                service.getTable("test");
            }).toThrow();
            expect(function () {
                service.getTable({
                    "test": 123
                });
            }).toThrow();
        });
    });

    describe("getHeadToHead", function () {
        it("Should return the headToHead view model", function (done) {
            $httpBackend.when("GET", /http\:\/\/statistics\.test\.com\/head2head\/betsson\/eng\/1\/.json.*/).respond(rawHead2HeadApiData);
            service.getHeadToHead(1, {
                participants: "18,3"
            }).then(function (result) {
                expect(result.length).toBe(1);
                expect(result[0].homeId).toBe(18);
                expect(result[0].awayId).toBe(3);
                done();
            });
            $httpBackend.flush();
        });

        it("should return null if the API call fails", function (done) {
            $httpBackend.when("GET", /http\:\/\/statistics\.test\.com\/head2head\/betsson\/eng\/1\/.json.*/).respond(404);
            service.getHeadToHead(1).then(function (result) {
                expect(result).toBe(null);
                done();
            });
            $httpBackend.flush();
        });

        it("should throw an error if no count was passed as a parameter", function () {
            expect(function () {
                service.getHeadToHead();
            }).toThrow();
            expect(function () {
                service.getHeadToHead("test");
            }).toThrow();
            expect(function () {
                service.getHeadToHead({
                    "test": 123
                });
            }).toThrow();
        });
    });

    describe("getFixtures", function () {
        it("should return the fixtures view model", function (done) {
            $httpBackend.when("GET", /http\:\/\/statistics\.test\.com\/fixtures\/betsson\/0\/eng\/0\/2\/.json.*/).respond(rawFixturesApiData);
            service.getFixtures(0, 0, 2, {
                participant: "3",
                adv: 0
            }).then(function (result) {
                expect(result.length).toBe(1);
                expect(result[0].id).toBe(3);
                expect(result[0].events.length).toBe(1);
                done();
            });
            $httpBackend.flush();
        });

        it("should return null if the API call fails", function (done) {
            $httpBackend.when("GET", /http\:\/\/statistics\.test\.com\/fixtures\/betsson\/0\/eng\/0\/2\/.json.*/).respond(404);
            service.getFixtures(0, 0, 2).then(function (result) {
                expect(result).toBe(null);
                done();
            });
            $httpBackend.flush();
        });

        it("should throw an error if no competition, count and offset parameters were passed", function () {
            expect(function () {
                service.getFixtures();
            }).toThrow();
            expect(function () {
                service.getFixtures("test");
            }).toThrow();
            expect(function () {
                service.getFixtures({
                    "test": 123
                });
            }).toThrow();
            expect(function () {
                service.getFixtures(123);
            }).toThrow();
            expect(function () {
                service.getFixtures(123, 456);
            }).toThrow();
        });
    });

    describe("getStandings", function () {
        it("should call the getTable method with competition and options.participants parameters", function () {
            spyOn(service, "getTable");
            $httpBackend.when("GET", /http\:\/\/statistics\.test\.com\/tables\/betsson\/1337\/eng\/0.json.*/).respond(rawTablesApiData);
            var options = {
                participants: "21,11",
                fields: "pts"
            };
            service.getStandings("1337", options);
            expect(service.getTable).toHaveBeenCalledWith(1337, options);
        });

        it("should return null if the API call fails", function (done) {
            $httpBackend.when("GET", /http\:\/\/statistics\.test\.com\/tables\/betsson\/1337\/eng\/0.json.*/).respond(404);
            var options = {
                participants: "21,11",
                fields: "pts"
            };
            service.getStandings("1337", options).then(function (result) {
                expect(result).toBe(null);
                done();
            });
            $httpBackend.flush();
        });

        it("should throw an error if no competition ID was passed as a parameter", function () {
            expect(function () {
                service.getStandings();
            }).toThrow();
            expect(function () {
                service.getStandings("test");
            }).toThrow();
            expect(function () {
                service.getStandings({
                    "test": 123
                });
            }).toThrow();
        });
    });
});
